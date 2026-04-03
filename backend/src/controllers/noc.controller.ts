import { Request, Response } from 'express';
import prisma from '../config/db';

export const applyNoc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { officerId, applicationDate, remarks } = req.body;

    if (!officerId) {
      res.status(400).json({ message: 'Officer ID is required' });
      return;
    }

    // Double check clearance before allowing application
    const activeAssignments = await prisma.assignment.count({
      where: {
        officerId,
        actualReturnDate: null
      }
    });

    if (activeAssignments > 0) {
      res.status(400).json({ 
        message: 'Cannot apply for NOC. Officer has pending assets.',
        activeAssignments 
      });
      return;
    }

    const noc = await prisma.nocClearance.create({
      data: {
        officerId,
        applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
        status: 'Pending',
        remarks
      }
    });

    res.status(201).json({
      message: 'NOC application submitted successfully',
      data: noc
    });
  } catch (error) {
    console.error('ApplyNoc error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveNoc = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { status, remarks } = req.body; // status could be Approved or Rejected

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid NOC ID' });
      return;
    }

    const noc = await prisma.nocClearance.findUnique({
      where: { id }
    });

    if (!noc) {
      res.status(404).json({ message: 'NOC application not found' });
      return;
    }

    const updatedNoc = await prisma.nocClearance.update({
      where: { id },
      data: {
        status: status || 'Approved',
        approvalDate: (status === 'Approved' || !status) ? new Date() : null,
        remarks: remarks || noc.remarks
      }
    });

    res.status(200).json({
      message: `NOC application ${updatedNoc.status.toLowerCase()} successfully`,
      data: updatedNoc
    });
  } catch (error) {
    console.error('ApproveNoc error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNocList = async (req: Request, res: Response): Promise<void> => {
  try {
    const nocs = await prisma.nocClearance.findMany({
      include: {
        officer: true
      },
      orderBy: { applicationDate: 'desc' }
    });
    res.status(200).json(nocs);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
