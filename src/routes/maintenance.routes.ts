import { Router } from 'express';
import { sendToMaintenance, receiveFromMaintenance, getMaintenanceHistory } from '../controllers/maintenance.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/send', authenticate, sendToMaintenance);
router.put('/receive/:id', authenticate, receiveFromMaintenance);
router.get('/history/:assetId', authenticate, getMaintenanceHistory);

export default router;
