import { Request, Response } from "express";
import prisma from "../config/db";

export const getOfficers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [officers, total] = await Promise.all([
      prisma.officer.findMany({
        skip,
        take: limit,
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          _count: {
            select: { 
              assignments: {
                where: { actualReturnDate: null }
              } 
            },
          },
        },
        orderBy: { id: "desc" },
      }),
      prisma.officer.count(),
    ]);

    res.status(200).json({
      data: officers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GetOfficers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOfficerById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid officer ID" });
      return;
    }

    const officer = await prisma.officer.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        assignments: {
          where: {
            actualReturnDate: null,
          },
          include: {
            asset: {
              include: {
                category: true,
              },
            },
          },
        },
        nocClearance: true,
      },
    });

    if (!officer) {
      res.status(404).json({ message: "Officer not found" });
      return;
    }

    res.status(200).json(officer);
  } catch (error) {
    console.error("GetOfficerById error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const transferOfficer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const officerId = parseInt(req.params.id as string);
    const { newBranchId, assetsToCarry: rawCarry, assetsToLeave: rawLeave, targetOfficerId } = req.body;

    const assetsToCarry = Array.isArray(rawCarry) ? rawCarry.map(id => parseInt(id as any)) : [];
    const assetsToLeave = Array.isArray(rawLeave) ? rawLeave.map(id => parseInt(id as any)) : [];
    const parsedTargetOfficerId = targetOfficerId ? parseInt(targetOfficerId) : null;

    if (isNaN(officerId)) {
      res.status(400).json({ message: "Invalid officer ID" });
      return;
    }

    if (!newBranchId) {
      res.status(400).json({ message: "New branch ID is required" });
      return;
    }

    const [officer, newBranch, targetOfficer] = await Promise.all([
      prisma.officer.findUnique({
        where: { id: officerId },
        include: { branch: true },
      }),
      prisma.branch.findUnique({
        where: { id: parseInt(newBranchId) },
      }),
      parsedTargetOfficerId ? prisma.officer.findUnique({
        where: { id: parsedTargetOfficerId },
      }) : Promise.resolve(null),
    ]);

    if (!officer) {
      res.status(404).json({ message: "Officer not found" });
      return;
    }

    if (!newBranch) {
      res.status(404).json({ message: "New branch not found" });
      return;
    }

    if (parsedTargetOfficerId && !targetOfficer) {
      res.status(404).json({ message: "Target officer for handover not found" });
      return;
    }

    const oldBranchName = officer.branch?.name || "Unknown";

    const result = await prisma.$transaction(async (tx) => {
      const updatedOfficer = await tx.officer.update({
        where: { id: officerId },
        data: { branchId: parseInt(newBranchId) },
      });

      if (assetsToCarry && Array.isArray(assetsToCarry) && assetsToCarry.length > 0) {
        await tx.asset.updateMany({
          where: { id: { in: assetsToCarry } },
          data: { branchId: parseInt(newBranchId) },
        });

        await tx.activityLog.createMany({
          data: assetsToCarry.map((assetId) => ({
            assetId,
            actionType: "শাখা বদলি",
            description: `${newBranch.name} এ বদলি হওয়া অফিসারের সাথে অ্যাসেট স্থানান্তর করা হয়েছে`,
          })),
        });
      }

      if (assetsToLeave && Array.isArray(assetsToLeave) && assetsToLeave.length > 0) {
        const assignmentsToClose = await tx.assignment.findMany({
          where: {
            officerId,
            assetId: { in: assetsToLeave },
            actualReturnDate: null,
          },
        });

        if (assignmentsToClose.length > 0) {
          await tx.assignment.updateMany({
            where: { id: { in: assignmentsToClose.map((a) => a.id) } },
            data: {
              actualReturnDate: new Date(),
              returnCondition: targetOfficer ? "Handed over to " + targetOfficer.name : "Good (Left at Branch)",
            },
          });
        }

        await tx.asset.updateMany({
          where: { id: { in: assetsToLeave } },
          data: { 
            status: targetOfficer ? "Assigned" : ("Available" as any),
            currentOfficerId: targetOfficer ? targetOfficer.id : null,
            branchId: targetOfficer && targetOfficer.branchId ? targetOfficer.branchId : undefined
          },
        });

        if (targetOfficer) {
          await tx.assignment.createMany({
            data: assetsToLeave.map((assetId) => ({
              assetId,
              officerId: targetOfficer.id,
              issueDate: new Date(),
              comments: `Received from ${officer.name} during their transfer`,
            })),
          });
        }

        for (const assetId of assetsToLeave) {
          await tx.activityLog.create({
            data: {
              assetId,
              actionType: targetOfficer ? "হস্তান্তর" : "ফেরত গ্রহণ",
              description: targetOfficer 
                ? `অফিসার ${officer.name} থেকে ${targetOfficer.name} এর নিকট অ্যাসেট হস্তান্তর করা হয়েছে`
                : `অফিসার ${officer.name} কর্তৃক ${oldBranchName} এ অ্যাসেটটি ফেরত প্রদান করা হয়েছে`,
            }
          });
        }
      }

      return updatedOfficer;
    });

    res.status(200).json({
      message: "Officer transferred successfully",
      officer: officer.name,
      from: oldBranchName,
      to: newBranch.name,
      handoverTo: targetOfficer ? targetOfficer.name : null
    });
  } catch (error) {
    console.error("TransferOfficer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkClearance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const officerId = parseInt(req.params.id as string);
    if (isNaN(officerId)) {
      res.status(400).json({ message: "Invalid officer ID" });
      return;
    }

    const [officer, activeAssignments] = await Promise.all([
      prisma.officer.findUnique({ where: { id: officerId } }),
      prisma.assignment.findMany({
        where: {
          officerId,
          actualReturnDate: null,
        },
        include: { asset: true },
      }),
    ]);

    if (!officer) {
      res.status(404).json({ message: "Officer not found" });
      return;
    }

    const isClear = activeAssignments.length === 0;

    res.status(200).json({
      officerName: officer.name,
      isClear,
      pendingAssetsCount: activeAssignments.length,
      pendingAssets: activeAssignments.map((a) => ({
        assetTag: a.asset?.assetTag,
        name: a.assetId,
      })),
      message: isClear
        ? "Officer is clear to proceed with NOC"
        : "Officer has pending assets that must be returned first",
    });
  } catch (error) {
    console.error("CheckClearance error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createOfficer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, designation, department, phone, email, photoUrl: photoUrlFromLink, branchId } = req.body;
    let photoUrl = null;

    if (req.file) {
      photoUrl = `/uploads/officers/${req.file.filename}`;
    } else if (photoUrlFromLink) {
      photoUrl = photoUrlFromLink;
    }

    if (!name) {
      res.status(400).json({ message: "Officer name is required" });
      return;
    }

    const officer = await prisma.officer.create({
      data: {
        name,
        designation,
        department,
        phone,
        email,
        photoUrl,
        branchId: branchId ? parseInt(branchId) : null,
      },
    });

    res.status(201).json({
      message: "Officer created successfully",
      data: officer,
    });
  } catch (error) {
    console.error("CreateOfficer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOfficer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid officer ID" });
      return;
    }

    const { name, designation, department, phone, email, isActive, photoUrl: photoUrlFromLink, branchId } = req.body;
    let photoUrl = undefined;

    if (req.file) {
      photoUrl = `/uploads/officers/${req.file.filename}`;
    } else if (photoUrlFromLink !== undefined) {
      const serverUrl = `${req.protocol}://${req.get('host')}/uploads/`;
      if (typeof photoUrlFromLink === 'string' && photoUrlFromLink.includes('/uploads/')) {
         const parts = photoUrlFromLink.split('/uploads/');
         photoUrl = `/uploads/${parts[parts.length - 1]}`;
      } else {
         photoUrl = photoUrlFromLink;
      }
    }

    const existingOfficer = await prisma.officer.findUnique({ where: { id } });
    if (!existingOfficer) {
      res.status(404).json({ message: "Officer not found" });
      return;
    }

    let parsedBranchId = undefined;
    if (branchId === "" || branchId === "null" || branchId === null) {
      parsedBranchId = null;
    } else if (branchId !== undefined) {
      const parsed = parseInt(branchId as string);
      if (!isNaN(parsed)) {
        parsedBranchId = parsed;
      }
    }

    const updatedOfficer = await prisma.officer.update({
      where: { id },
      data: {
        name,
        designation,
        department,
        phone,
        email,
        photoUrl,
        branchId: parsedBranchId,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : undefined,
      },
    });

    res.status(200).json({
      message: "Officer updated successfully",
      data: updatedOfficer,
    });
  } catch (error) {
    console.error("UpdateOfficer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOfficer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid officer ID" });
      return;
    }

    const officer = await prisma.officer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { assignments: true },
        },
      },
    });

    if (!officer) {
      res.status(404).json({ message: "Officer not found" });
      return;
    }

    if (officer._count.assignments > 0) {
      res
        .status(400)
        .json({
          message: "Cannot delete officer with active or past assignments",
        });
      return;
    }

    await prisma.officer.delete({ where: { id } });

    res.status(200).json({ message: "Officer deleted successfully" });
  } catch (error) {
    console.error("DeleteOfficer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
