import { Router } from 'express';
import {
  listGalleryAssets,
  getGalleryCategories,
  getGalleryTags,
  getGalleryAsset,
} from '../controllers/galleryAssets.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Tüm route'lar authentication gerektirir
router.use(authenticate);

// Restaurant Admin ve Super Admin erişebilir
router.use(authorize('SUPER_ADMIN', 'RESTAURANT_ADMIN'));

// List gallery assets with filters
router.get('/', listGalleryAssets);

// Get filter options
router.get('/categories', getGalleryCategories);
router.get('/tags', getGalleryTags);

// Get single asset
router.get('/:id', getGalleryAsset);

export default router;
