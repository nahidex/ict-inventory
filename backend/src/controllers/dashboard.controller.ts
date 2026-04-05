import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalAssets,
      availableAssets,
      assignedAssets,
      underRepairAssets,
      disposedAssets,
      totalOfficers,
      totalCategories,
      pendingNocRequests,
      pendingRepairs,
      recentActivities,
      categoryDistribution
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'Available' } }),
      prisma.asset.count({ where: { status: 'Assigned' } }),
      prisma.asset.count({ where: { status: 'Under_Repair' as any } }),
      prisma.asset.count({ where: { status: 'Disposed' } }),
      prisma.officer.count(),
      prisma.category.count(),
      prisma.nocClearance.count({ where: { status: 'Pending' } }),
      (prisma as any).maintenance.count({ where: { repair_status: 'Pending' } }),
      prisma.activityLog.findMany({
        take: 5,
        orderBy: { performedAt: 'desc' },
        include: { asset: { select: { assetTag: true } } }
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { assets: true }
          }
        }
      })
    ]);

    res.status(200).json({
      summary: {
        assets: {
          total: totalAssets,
          available: availableAssets,
          assigned: assignedAssets,
          underRepair: underRepairAssets,
          disposed: disposedAssets,
        },
        resources: {
          officers: totalOfficers,
          categories: totalCategories,
        },
        alerts: {
          pendingNoc: pendingNocRequests,
          pendingRepairs: pendingRepairs,
        }
      },
      recentActivities,
      categoryDistribution: categoryDistribution.map(cat => ({
        name: cat.name,
        code: cat.code,
        assetCount: cat._count.assets
      }))
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
