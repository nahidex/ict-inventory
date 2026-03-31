import { Router } from 'express';
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from '../controllers/asset.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getAssets);
router.post('/', authenticate, createAsset);
router.get('/:id', authenticate, getAssetById);
router.patch('/:id', authenticate, updateAsset);
router.delete('/:id', authenticate, deleteAsset);

export default router;
