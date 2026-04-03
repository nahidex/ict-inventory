import { Request, Response } from "express";
import prisma from "../config/db";

/**
 * Get all branches
 */
export const getBranches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        _count: {
          select: { assets: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(branches);
  } catch (error) {
    console.error("GetBranches error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Create a new branch
 */
export const createBranch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, code, location, roomNumber, phoneExt, status } = req.body;

    if (!name || !code || !location) {
      res
        .status(400)
        .json({ message: "Name, code, and location are required" });
      return;
    }

    const existing = await prisma.branch.findUnique({
      where: { code },
    });

    if (existing) {
      res.status(400).json({ message: "Branch code already exists" });
      return;
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        code,
        location,
        roomNumber,
        phoneExt,
        status: status || "Active",
      },
    });

    res.status(201).json({
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error) {
    console.error("CreateBranch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update branch details
 */
export const updateBranch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const idParam = req.params.id as string;
    const id = parseInt(idParam);
    const { name, code, location, roomNumber, phoneExt, status } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid branch ID" });
      return;
    }

    const existingBranch = await prisma.branch.findUnique({ where: { id } });
    if (!existingBranch) {
      res.status(404).json({ message: "Branch not found" });
      return;
    }

    if (code && code !== existingBranch.code) {
      const existingCode = await prisma.branch.findUnique({ where: { code } });
      if (existingCode) {
        res.status(400).json({ message: "Branch code already exists" });
        return;
      }
    }

    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingBranch.name,
        code: code !== undefined ? code : existingBranch.code,
        location: location !== undefined ? location : existingBranch.location,
        roomNumber:
          roomNumber !== undefined ? roomNumber : existingBranch.roomNumber,
        phoneExt: phoneExt !== undefined ? phoneExt : existingBranch.phoneExt,
        status: status !== undefined ? status : existingBranch.status,
      },
    });

    res.status(200).json({
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    console.error("UpdateBranch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get assets for a specific branch
 */
export const getBranchAssets = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const idParam = req.params.id as string;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid branch ID" });
      return;
    }

    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        assets: {
          include: {
            category: true,
            currentOfficer: true,
          },
        },
      },
    });

    if (!branch) {
      res.status(404).json({ message: "Branch not found" });
      return;
    }

    res.status(200).json({
      branchName: branch.name,
      branchCode: branch.code,
      assets: branch.assets,
    });
  } catch (error) {
    console.error("GetBranchAssets error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
