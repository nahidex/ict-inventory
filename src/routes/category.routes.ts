import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getCategories);
router.post('/', authenticate, createCategory);
router.patch('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
