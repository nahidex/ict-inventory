import { Request, Response } from 'express';
import prisma from '../config/db';

export const issueAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId, officerId, issueDate, comments } = req.body;

    if (!assetId || !officerId || !issueDate) {
      res.status(400).json({ message: 'Asset ID, Officer ID, and Issue Date are required' });
      return;
    }

    // Check if asset is available
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    if (asset.status !== 'Available') {
      res.status(400).json({ message: `Asset is not available for assignment. Current status: ${asset.status}` });
      return;
    }

    // Check if officer exists
    const officer = await prisma.officer.findUnique({ where: { id: officerId } });
    if (!officer) {
      res.status(404).json({ message: 'Officer not found' });
      return;
    }

    // Create assignment and update asset status in a transaction
    const result = await prisma.$transaction([
      prisma.assignment.create({
        data: {
          assetId,
          officerId,
          issueDate: new Date(issueDate),
          comments,
          issuedBy: (req as any).user.id,
        }
      }),
      prisma.asset.update({
        where: { id: assetId },
        data: { status: 'Assigned' } as any
      }),
      prisma.activityLog.create({
        data: {
          assetId,
          actionType: 'বরাদ্দ প্রদান',
          description: `অফিসার ${officer.name} কে অ্যাসেট বরাদ্দ প্রদান করা হয়েছে`
        }
      })
    ]);

    res.status(201).json({
      message: 'Asset assigned successfully',
      data: result[0]
    });
  } catch (error) {
    console.error('IssueAsset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const returnAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = req.params.id as string;
    const assignmentId = parseInt(idStr);
    const { actualReturnDate, returnCondition, comments } = req.body || {};
    let returnImageUrl = null;

    if (req.file) {
      returnImageUrl = `/uploads/assignments/${req.file.filename}`;
    }

    if (isNaN(assignmentId)) {
      res.status(400).json({ message: 'Invalid assignment ID' });
      return;
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { asset: { include: { currentOfficer: true } } }
    });

    if (!assignment) {
      res.status(404).json({ message: 'Assignment record not found' });
      return;
    }

    if (assignment.actualReturnDate) {
      res.status(400).json({ message: 'Asset has already been returned' });
      return;
    }

    const officerName = assignment.asset?.currentOfficer?.name || 'অফিসার';

    // Update assignment and set asset to Available in a transaction
    await prisma.$transaction([
      prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          actualReturnDate: actualReturnDate ? new Date(actualReturnDate) : new Date(),
          returnCondition,
          returnImageUrl,
          comments: comments ? `${assignment.comments || ''}\nReturn Note: ${comments}` : assignment.comments
        }
      }),
      prisma.asset.update({
        where: { id: assignment.assetId! },
        data: { 
          status: 'Available',
          currentOfficerId: null
        } as any
      }),
      prisma.activityLog.create({
        data: {
          assetId: assignment.assetId,
          actionType: 'ফেরত গ্রহণ',
          description: `${officerName} থেকে অ্যাসেটটি স্টোরে ফেরত নেয়া হয়েছে। কন্ডিশন: ${returnCondition || 'ভাল'}`
        }
      })
    ]);

    res.status(200).json({ message: 'Asset returned successfully' });
  } catch (error) {
    console.error('ReturnAsset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getActiveAssignmentsByOfficer = async (req: Request, res: Response): Promise<void> => {
  try {
    const officerId = parseInt(req.params.officerId as string);

    if (isNaN(officerId)) {
      res.status(400).json({ message: 'Invalid officer ID' });
      return;
    }

    const activeAssignments = await prisma.assignment.findMany({
      where: {
        officerId,
        actualReturnDate: null, // Only those not yet returned
      },
      include: {
        asset: {
          include: {
            category: true
          }
        }
      },
      orderBy: { issueDate: 'desc' }
    });

    res.status(200).json(activeAssignments);
  } catch (error) {
    console.error('GetActiveAssignments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        asset: true,
        officer: true
      },
      orderBy: { issueDate: 'desc' }
    });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
