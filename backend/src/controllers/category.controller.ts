import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { assets: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('GetCategories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      res.status(400).json({ message: 'Name and Code are required' });
      return;
    }

    const existing = await prisma.category.findUnique({
      where: { code }
    });

    if (existing) {
      res.status(400).json({ message: 'Category code already exists' });
      return;
    }

    const category = await prisma.category.create({
      data: { name, code }
    });

    res.status(201).json({
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('CreateCategory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = req.params.id as string;
    const id = parseInt(idStr);
    const { name, code } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    if (code && code !== category.code) {
      const existing = await prisma.category.findUnique({ where: { code } });
      if (existing) {
        res.status(400).json({ message: 'Category code already exists' });
        return;
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name, code }
    });

    res.status(200).json({
      message: 'Category updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('UpdateCategory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const idStr = req.params.id as string;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { assets: true } } }
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    if (category._count.assets > 0) {
      res.status(400).json({ message: 'Cannot delete category with associated assets' });
      return;
    }

    await prisma.category.delete({ where: { id } });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('DeleteCategory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
