import { Request, Response } from 'express';
import prisma from '../config/db';
import { AssetStatus } from '@prisma/client';

/**
 * 1. Request Maintenance
 */
export const createMaintenanceRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId, officerId, issueDescription, startDate, vendorDetails } = req.body;

    if (!assetId || !issueDescription) {
      res.status(400).json({ message: 'Asset ID and Issue Description are required.' });
      return;
    }

    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      res.status(404).json({ message: 'Asset not found.' });
      return;
    }

    if ((asset.status as string) === 'Under_Repair') {
      res.status(400).json({ message: 'Asset is already under repair.' });
      return;
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const maintenanceRecord = await tx.maintenance.create({
        data: {
          assets: { connect: { id: assetId } },
          officers: officerId ? { connect: { id: officerId } } : undefined,
          issue_description: issueDescription,
          sent_date: startDate ? new Date(startDate) : new Date(),
          vendor_name: vendorDetails,
          repair_status: 'Pending',
        }
      });

      await tx.asset.update({
        where: { id: assetId },
        data: { status: AssetStatus.Under_Repair }
      });

      await tx.activityLog.create({
        data: {
          assetId: assetId,
          actionType: 'MAINTENANCE_SEND',
          description: 'Asset sent to maintenance. Issue: ' + issueDescription
        }
      });

      return maintenanceRecord;
    });

    res.status(201).json({
      message: 'Maintenance request created successfully.',
      data: result
    });
  } catch (error) {
    console.error('CreateMaintenanceRequest error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * 2. List All Records
 */
export const getAllMaintenanceRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await (prisma as any).maintenance.findMany({
      include: {
        assets: {
          include: {
            category: true
          }
        },
        officers: {
          select: {
            id: true,
            name: true,
            designation: true,
            photoUrl: true,
            branch: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { sent_date: 'desc' }
    });

    res.status(200).json(records);
  } catch (error) {
    console.error('GetAllMaintenanceRecords error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * 3. Get Single Record
 */
export const getMaintenanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = typeof req.params.id === 'string' ? parseInt(req.params.id) : 0;
    const record = await (prisma as any).maintenance.findUnique({
      where: { id },
      include: {
        assets: {
          include: {
            category: true,
            currentOfficer: true
          }
        },
        officers: {
          include: {
            branch: true
          }
        }
      }
    });

    if (!record) {
      res.status(404).json({ message: 'Record not found.' });
      return;
    }

    res.status(200).json(record);
  } catch (error) {
    console.error('GetMaintenanceById error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * 4. Receive Logic
 */
export const receiveFromMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = typeof req.params.id === 'string' ? parseInt(req.params.id) : 0;
    const { 
      receive_date, 
      repair_cost, 
      repair_status, 
      return_to_officer, 
      note 
    } = req.body;

    const maintenance = await (prisma as any).maintenance.findUnique({
      where: { id },
      include: { assets: true }
    });

    if (!maintenance) {
      res.status(404).json({ message: 'Maintenance record not found.' });
      return;
    }

    const assetId = maintenance.asset_id;

    const result = await prisma.$transaction(async (tx: any) => {
      const updatedMaintenance = await tx.maintenance.update({
        where: { id },
        data: {
          receive_date: receive_date ? new Date(receive_date) : new Date(),
          repair_cost: parseFloat(repair_cost) || 0,
          repair_status: repair_status === 'Unrepairable' ? 'Completed' : (repair_status || 'Completed')
        }
      });

      let newAssetStatus: AssetStatus = AssetStatus.Available;
      let newCurrentOfficerId = maintenance.assets?.currentOfficerId;

      if (repair_status === 'Unrepairable') {
        newAssetStatus = AssetStatus.Disposed;
        newCurrentOfficerId = null;
      } else if (return_to_officer === true && newCurrentOfficerId) {
        newAssetStatus = AssetStatus.Assigned;
      } else {
        newAssetStatus = AssetStatus.Available;
        newCurrentOfficerId = null;
      }

      const updatedAsset = await tx.asset.update({
        where: { id: assetId },
        data: {
          status: newAssetStatus,
          currentOfficerId: newCurrentOfficerId
        }
      });

      await tx.activityLog.create({
        data: {
          assetId: assetId,
          actionType: 'MAINTENANCE_RECEIVED',
          description: 'Maintenance completed. Status: ' + newAssetStatus + '. Cost: ' + repair_cost + '. ' + (note || '')
        }
      });

      return { updatedMaintenance, updatedAsset };
    });

    res.status(200).json({
      message: 'Maintenance completed successfully.',
      data: result
    });
  } catch (error) {
    console.error('ReceiveFromMaintenance error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * 5. History
 */
export const getMaintenanceHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = typeof req.params.assetId === 'string' ? parseInt(req.params.assetId) : 0;
    if(isNaN(id) || id === 0) {
        res.status(400).json({ message: 'Invalid asset ID' });
        return;
    }
    const history = await (prisma as any).maintenance.findMany({
      where: { asset_id: id },
      orderBy: { sent_date: 'desc' },
      include: { officers: true }
    });
    res.status(200).json(history);
  } catch (error) {
    console.error('GetMaintenanceHistory error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const sendToMaintenance = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: "Handled by createMaintenanceRequest" });
};
