import { Router } from 'express';
import { getActivityLogs, getAssetTimeline } from '../controllers/activity-log.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getActivityLogs);
router.get('/:id/timeline', authenticate, getAssetTimeline);

export default router;
