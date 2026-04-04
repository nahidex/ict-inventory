import { Router } from 'express';
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from '../controllers/asset.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', authenticate, getAssets);
router.post('/', authenticate, upload.single('image'), createAsset);
router.get('/:id', authenticate, getAssetById);
router.patch('/:id', authenticate, upload.single('image'), updateAsset);
router.delete('/:id', authenticate, deleteAsset);

export default router;
