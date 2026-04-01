import { Request, Response } from 'express';
import prisma from '../config/db';

export const sendToMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId, issueDescription, sentDate, vendorName } = req.body;

    if (!assetId || !issueDescription) {
      res.status(400).json({ message: 'Asset ID and Issue Description are required' });
      return;
    }

    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    if (asset.status === 'Under_Repair') {
      res.status(400).json({ message: 'Asset is already under repair' });
      return;
    }

    const result = await prisma.$transaction([
      prisma.maintenance.create({
        data: {
          assetId,
          issueDescription,
          sentDate: sentDate ? new Date(sentDate) : new Date(),
          vendorName,
          repairStatus: 'Pending',
        }
      }),
      prisma.asset.update({
        where: { id: assetId },
        data: { status: 'Under_Repair' } as any
      }),
      prisma.activityLog.create({
        data: {
          assetId,
          actionType: 'MAINTENANCE_SEND',
          description: `Asset sent to maintenance. Issue: ${issueDescription}`
        }
      })
    ]);

    res.status(201).json({
      message: 'Asset sent to maintenance successfully',
      data: result[0]
    });
  } catch (error) {
    console.error('SendToMaintenance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const receiveFromMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { receiveDate, repairCost, repairStatus, notes } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid maintenance ID' });
      return;
    }

    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: { asset: true }
    });

    if (!maintenance) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }

    if (maintenance.repairStatus === 'Completed') {
      res.status(400).json({ message: 'Maintenance already marked as completed' });
      return;
    }

    const finalRepairStatus = repairStatus || 'Completed';

    await prisma.$transaction([
      prisma.maintenance.update({
        where: { id },
        data: {
          receiveDate: receiveDate ? new Date(receiveDate) : new Date(),
          repairCost: repairCost ? parseFloat(repairCost) : maintenance.repairCost,
          repairStatus: finalRepairStatus,
        }
      }),
      prisma.asset.update({
        where: { id: maintenance.assetId! },
        data: { status: 'Available' } as any
      }),
      prisma.activityLog.create({
        data: {
          assetId: maintenance.assetId,
          actionType: 'MAINTENANCE_RECEIVE',
          description: `Asset received from maintenance. Status: ${finalRepairStatus}. Cost: ${repairCost || 0}`
        }
      })
    ]);

    res.status(200).json({ message: 'Asset received from maintenance successfully' });
  } catch (error) {
    console.error('ReceiveFromMaintenance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMaintenanceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const assetId = parseInt(req.params.assetId as string);

    if (isNaN(assetId)) {
      res.status(400).json({ message: 'Invalid asset ID' });
      return;
    }

    const history = await prisma.maintenance.findMany({
      where: { assetId },
      orderBy: { sentDate: 'desc' }
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('GetMaintenanceHistory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
