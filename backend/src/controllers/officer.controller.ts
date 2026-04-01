import { Request, Response } from 'express';
import prisma from '../config/db';

export const getOfficers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [officers, total] = await Promise.all([
      prisma.officer.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { assignments: true }
          }
        },
        orderBy: { id: 'desc' },
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
    console.error('GetOfficers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOfficerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid officer ID' });
      return;
    }

    const officer = await prisma.officer.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            asset: true
          }
        },
        nocClearance: true
      }
    });

    if (!officer) {
      res.status(404).json({ message: 'Officer not found' });
      return;
    }

    res.status(200).json(officer);
  } catch (error) {
    console.error('GetOfficerById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkClearance = async (req: Request, res: Response): Promise<void> => {
  try {
    const officerId = parseInt(req.params.id as string);
    if (isNaN(officerId)) {
      res.status(400).json({ message: 'Invalid officer ID' });
      return;
    }

    const [officer, activeAssignments] = await Promise.all([
      prisma.officer.findUnique({ where: { id: officerId } }),
      prisma.assignment.findMany({
        where: {
          officerId,
          actualReturnDate: null
        },
        include: { asset: true }
      })
    ]);

    if (!officer) {
      res.status(404).json({ message: 'Officer not found' });
      return;
    }

    const isClear = activeAssignments.length === 0;

    res.status(200).json({
      officerName: officer.name,
      isClear,
      pendingAssetsCount: activeAssignments.length,
      pendingAssets: activeAssignments.map(a => ({
        assetTag: a.asset?.assetTag,
        name: a.assetId // or asset name if you add it to the model
      })),
      message: isClear 
        ? 'Officer is clear to proceed with NOC' 
        : 'Officer has pending assets that must be returned first'
    });
  } catch (error) {
    console.error('CheckClearance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createOfficer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, designation, department, phone, email } = req.body;
    let photoUrl = null;

    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    if (!name) {
      res.status(400).json({ message: 'Officer name is required' });
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
      }
    });

    res.status(201).json({
      message: 'Officer created successfully',
      data: officer
    });
  } catch (error) {
    console.error('CreateOfficer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOfficer = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid officer ID' });
      return;
    }

    const { name, designation, department, phone, email, isActive } = req.body;
    let photoUrl = undefined;

    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const existingOfficer = await prisma.officer.findUnique({ where: { id } });
    if (!existingOfficer) {
      res.status(404).json({ message: 'Officer not found' });
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
        isActive: isActive !== undefined ? isActive : undefined,
      }
    });

    res.status(200).json({
      message: 'Officer updated successfully',
      data: updatedOfficer
    });
  } catch (error) {
    console.error('UpdateOfficer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteOfficer = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid officer ID' });
      return;
    }

    const officer = await prisma.officer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { assignments: true }
        }
      }
    });

    if (!officer) {
      res.status(404).json({ message: 'Officer not found' });
      return;
    }

    if (officer._count.assignments > 0) {
      res.status(400).json({ message: 'Cannot delete officer with active or past assignments' });
      return;
    }

    await prisma.officer.delete({ where: { id } });

    res.status(200).json({ message: 'Officer deleted successfully' });
  } catch (error) {
    console.error('DeleteOfficer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
