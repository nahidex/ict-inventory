import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id as string);
    const { role } = req.body;

    if (!['ADMIN', 'USER'].includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.status(200).json({
      message: 'User role updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id as string);
    
    // Prevent self-deletion
    if (userId === (req as any).user.id) {
       res.status(400).json({ message: 'Cannot delete your own account' });
       return;
    }

    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
