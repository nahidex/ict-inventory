import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAssets = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId as string;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { assetTag: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { serialNumber: { contains: search } },
        { locationDetails: { contains: search } },
        { category: { name: { contains: search } } },
        { branch: { name: { contains: search } } },
        { currentOfficer: { name: { contains: search } } },
      ];
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (status) {
      where.status = status;
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          assignments: {
            where: { actualReturnDate: null },
            include: { officer: true },
            take: 1
          }
        },
        orderBy: {
          id: 'desc',
        } as any,
      }),
      prisma.asset.count({ where }),
    ]);

    res.status(200).json({
      data: assets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GetAssets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAssetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const assetId = parseInt(id as string);

    if (isNaN(assetId)) {
      res.status(400).json({ message: 'Invalid asset ID' });
      return;
    }

    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        category: true,
        assignments: {
          include: {
            officer: true,
          },
        },
        maintenance: true,
        activityLogs: true,
      },
    });

    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    res.status(200).json(asset);
  } catch (error) {
    console.error('GetAssetById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      assetTag, 
      categoryId, 
      brand, 
      model, 
      serialNumber, 
      purchaseDate, 
      purchaseSource, 
      status 
    } = req.body;

    const initialImageUrl = req.file ? `/uploads/assets/${req.file.filename}` : null;

    // Basic validation
    if (!assetTag) {
      res.status(400).json({ message: 'Asset tag is required' });
      return;
    }

    // Check if assetTag or serialNumber already exists
    const existingAsset = await prisma.asset.findFirst({
      where: {
        OR: [
          { assetTag },
          serialNumber ? { serialNumber } : {},
        ].filter(condition => Object.keys(condition).length > 0),
      },
    });

    if (existingAsset) {
      res.status(400).json({ message: 'Asset tag or Serial number already exists' });
      return;
    }

    const asset = await prisma.$transaction(async (tx) => {
      const newAsset = await tx.asset.create({
        data: {
          assetTag,
          categoryId: categoryId ? parseInt(categoryId) : null,
          brand,
          model,
          serialNumber,
          purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
          purchaseSource: purchaseSource || 'Budget',
          status: status || 'Available',
          initialImageUrl: initialImageUrl,
        } as any,
        include: {
          category: true,
        },
      });

      await tx.activityLog.create({
        data: {
          assetId: newAsset.id,
          actionType: 'CREATE',
          description: `Asset initially registered with tag ${assetTag}`
        }
      });

      return newAsset;
    });

    res.status(201).json({
      message: 'Asset created successfully',
      data: asset,
    });
  } catch (error) {
    console.error('CreateAsset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const assetId = parseInt(id as string);

    if (isNaN(assetId)) {
      res.status(400).json({ message: 'Invalid asset ID' });
      return;
    }

    const { 
      assetTag, 
      categoryId, 
      brand, 
      model, 
      serialNumber, 
      purchaseDate, 
      purchaseSource, 
      status 
    } = req.body;

    const initialImageUrl = req.file ? `/uploads/assets/${req.file.filename}` : undefined;

    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!existingAsset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    // Check if new assetTag or serialNumber conflicts with others
    if (assetTag || serialNumber) {
      const conflictAsset = await prisma.asset.findFirst({
        where: {
          id: { not: assetId },
          OR: [
            assetTag ? { assetTag } : {},
            serialNumber ? { serialNumber } : {},
          ].filter(condition => Object.keys(condition).length > 0),
        },
      });

      if (conflictAsset) {
        res.status(400).json({ message: 'Asset tag or Serial number already exists' });
        return;
      }
    }

    const updatedAsset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        assetTag,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        brand,
        model,
        serialNumber,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        purchaseSource,
        status,
        initialImageUrl: initialImageUrl,
      } as any,
      include: {
        category: true,
      },
    });

    res.status(200).json({
      message: 'Asset updated successfully',
      data: updatedAsset,
    });
  } catch (error) {
    console.error('UpdateAsset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const assetId = parseInt(id as string);

    if (isNaN(assetId)) {
      res.status(400).json({ message: 'Invalid asset ID' });
      return;
    }

    // Check if asset exists
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    await prisma.asset.delete({
      where: { id: assetId },
    });

    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('DeleteAsset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
