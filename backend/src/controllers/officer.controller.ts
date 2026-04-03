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
            select: { assignments: true },
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
          include: {
            asset: true,
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
        name: a.assetId, // or asset name if you add it to the model
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

    // Logic: If there's an uploaded file, use it. 
    // Otherwise, if there's a link in photoUrl field, use that.
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

    // Logic: If there's an uploaded file, use it. 
    // Otherwise, if there's a link in photoUrl field, use that.
    // Otherwise, keep the existing one (don't update).
    if (req.file) {
      photoUrl = `/uploads/officers/${req.file.filename}`;
    } else if (photoUrlFromLink !== undefined) {
      photoUrl = photoUrlFromLink;
    }

    const existingOfficer = await prisma.officer.findUnique({ where: { id } });
    if (!existingOfficer) {
      res.status(404).json({ message: "Officer not found" });
      return;
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
        branchId: branchId ? parseInt(branchId) : undefined,
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

/**
 * Transfer Officer to a new Branch
 * Steps:
 * 1. Update Officer's branchId
 * 2. Update branchId for assets to carry
 * 3. Update currentOfficerId to null and status to Available for assets to leave
 * 4. Create activity log
 */
export const transferOfficer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const officerId = parseInt(req.params.id as string);
    const { newBranchId, assetsToCarry, assetsToLeave } = req.body;

    if (isNaN(officerId) || !newBranchId) {
      res
        .status(400)
        .json({ message: "Invalid Officer ID or New Branch ID missing" });
      return;
    }

    // 1. Check if officer and new branch exist
    const [officer, newBranch] = await Promise.all([
      prisma.officer.findUnique({
        where: { id: officerId },
        include: { branch: true },
      }),
      prisma.branch.findUnique({ where: { id: parseInt(newBranchId) } }),
    ]);

    if (!officer) {
      res.status(404).json({ message: "Officer not found" });
      return;
    }

    if (!newBranch) {
      res.status(404).json({ message: "New Branch not found" });
      return;
    }

    const oldBranchName = officer.branch?.name || "অজ্ঞাত শাখা";
    const newBranchName = newBranch.name;

    await prisma.$transaction(async (tx) => {
      // Step 1: Update Officer's branch
      await tx.officer.update({
        where: { id: officerId },
        data: { branchId: newBranch.id },
      });

      // Step 2: Assets to Carry (Update branchId, keep currentOfficerId)
      if (
        assetsToCarry &&
        Array.isArray(assetsToCarry) &&
        assetsToCarry.length > 0
      ) {
        await tx.asset.updateMany({
          where: {
            id: { in: assetsToCarry },
            currentOfficerId: officerId,
          },
          data: {
            branchId: newBranch.id,
          },
        });
      }

      // Step 3: Assets to Leave (Set currentOfficerId to null, keep branchId, set status Available)
      if (
        assetsToLeave &&
        Array.isArray(assetsToLeave) &&
        assetsToLeave.length > 0
      ) {
        // We need to update Assignment records too (mark as returned)
        await tx.assignment.updateMany({
          where: {
            assetId: { in: assetsToLeave },
            officerId: officerId,
            actualReturnDate: null,
          },
          data: {
            actualReturnDate: new Date(),
            returnCondition: "বদলির সময় রেখে যাওয়া হয়েছে",
          },
        });

        await tx.asset.updateMany({
          where: {
            id: { in: assetsToLeave },
            currentOfficerId: officerId,
          },
          data: {
            currentOfficerId: null,
            status: "Available",
          },
        });
      }

      // Step 4: Activity Log
      await tx.activityLog.create({
        data: {
          actionType: "OFFICER_TRANSFER",
          description: `অফিসার ${officer.name} ${oldBranchName} থেকে ${newBranchName}-এ বদলি হয়েছেন। ${assetsToCarry?.length || 0}টি মাল সাথে নিয়েছেন এবং ${assetsToLeave?.length || 0}টি মাল রেখে গেছেন।`,
        },
      });
    });

    res.status(200).json({
      message: "Officer transferred successfully",
      officer: officer.name,
      from: oldBranchName,
      to: newBranchName,
    });
  } catch (error) {
    console.error("OfficerTransfer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
