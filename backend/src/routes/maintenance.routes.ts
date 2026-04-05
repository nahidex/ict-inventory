import { Router } from 'express';
import { 
  createMaintenanceRequest,
  sendToMaintenance, 
  receiveFromMaintenance, 
  getMaintenanceHistory,
  getAllMaintenanceRecords,
  getMaintenanceById
} from '../controllers/maintenance.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllMaintenanceRecords);
router.get('/:id', authenticate, getMaintenanceById);
router.post('/request', authenticate, createMaintenanceRequest);
router.post('/send', authenticate, sendToMaintenance);
router.put('/receive/:id', authenticate, receiveFromMaintenance);
router.get('/history/:assetId', authenticate, getMaintenanceHistory);

export default router;
