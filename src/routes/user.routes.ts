import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Only ADMINs can manage users
router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.patch('/:id/role', authenticate, authorize(['ADMIN']), updateUserRole);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteUser);

export default router;
