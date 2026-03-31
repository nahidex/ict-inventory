import { Router } from 'express';
import { issueAsset, returnAsset, getAssignments, getActiveAssignmentsByOfficer } from '../controllers/assignment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getAssignments);
router.get('/active/:officerId', authenticate, getActiveAssignmentsByOfficer);
router.post('/issue', authenticate, issueAsset);
router.post('/return/:id', authenticate, returnAsset);

export default router;
