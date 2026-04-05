import { Router } from 'express';
import { register, login, getMe, logout, getUnlinkedOfficers } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.get('/unlinked-officers', getUnlinkedOfficers);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
