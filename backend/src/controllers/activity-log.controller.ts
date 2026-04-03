import { Request, Response } from 'express';
import prisma from '../config/db';

export const getActivityLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const assetId = req.query.assetId ? parseInt(req.query.assetId as string) : undefined;
    const actionType = req.query.actionType as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (assetId) where.assetId = assetId;
    if (actionType) where.actionType = actionType;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          asset: {
            select: {
              assetTag: true,
              brand: true,
              model: true
            }
          }
        },
        orderBy: { performedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where })
    ]);

    res.status(200).json({
      data: logs,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GetActivityLogs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAssetTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const assetId = parseInt(req.params.id as string);

    if (isNaN(assetId)) {
      res.status(400).json({ message: 'Invalid asset ID' });
      return;
    }

    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        category: true,
        activityLogs: {
          orderBy: { performedAt: 'desc' }
        }
      }
    });

    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    res.status(200).json({
      asset: {
        id: asset.id,
        assetTag: asset.assetTag,
        brand: asset.brand,
        model: asset.model,
        category: asset.category?.name,
        status: asset.status
      },
      timeline: asset.activityLogs
    });
  } catch (error) {
    console.error('GetAssetTimeline error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
