import { Router } from 'express';
import { applyNoc, approveNoc, getNocList } from '../controllers/noc.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getNocList);
router.post('/apply', authenticate, applyNoc);
router.put('/approve/:id', authenticate, approveNoc);

export default router;
