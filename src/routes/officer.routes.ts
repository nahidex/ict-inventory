import { Router } from 'express';
import { getOfficers, getOfficerById, createOfficer, updateOfficer, deleteOfficer, checkClearance } from '../controllers/officer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getOfficers);
router.get('/:id/clearance-check', authenticate, checkClearance);
router.post('/', authenticate, createOfficer);
router.get('/:id', authenticate, getOfficerById);
router.patch('/:id', authenticate, updateOfficer);
router.delete('/:id', authenticate, deleteOfficer);

export default router;
