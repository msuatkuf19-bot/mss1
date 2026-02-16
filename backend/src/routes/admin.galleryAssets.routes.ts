import { Router } from 'express';
import {
  createGalleryAsset,
  updateGalleryAsset,
  deleteGalleryAsset,
  toggleGalleryAsset,
  reorderGalleryAssets,
  listGalleryAssets,
} from '../controllers/galleryAssets.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Tüm route'lar authentication gerektirir
router.use(authenticate);

// Sadece Super Admin erişebilir (Restaurant Admin kendi scope'u için ayrı kontrol var controller'da)
router.use(authorize('SUPER_ADMIN', 'RESTAURANT_ADMIN'));

// List (admin versiyonu - tüm verileri görebilir)
router.get('/', listGalleryAssets);

// Create
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Başlık gerekli').isLength({ min: 2 }).withMessage('Başlık en az 2 karakter olmalı'),
    body('imageUrl').notEmpty().withMessage('Görsel URL gerekli').isURL().withMessage('Geçerli bir URL girin'),
    body('type').optional().isIn(['FOOD', 'DRINK', 'DESSERT', 'OTHER']).withMessage('Geçersiz tür'),
    body('scope').optional().isIn(['GLOBAL', 'RESTAURANT']).withMessage('Geçersiz kapsam'),
  ],
  createGalleryAsset
);

// Update
router.put(
  '/:id',
  [
    body('title').optional().isLength({ min: 2 }).withMessage('Başlık en az 2 karakter olmalı'),
    body('imageUrl').optional().isURL().withMessage('Geçerli bir URL girin'),
    body('type').optional().isIn(['FOOD', 'DRINK', 'DESSERT', 'OTHER']).withMessage('Geçersiz tür'),
    body('scope').optional().isIn(['GLOBAL', 'RESTAURANT']).withMessage('Geçersiz kapsam'),
  ],
  updateGalleryAsset
);

// Delete
router.delete('/:id', deleteGalleryAsset);

// Toggle active
router.patch('/:id/toggle', toggleGalleryAsset);

// Reorder
router.patch(
  '/reorder',
  [body('assetIds').isArray().withMessage('Görsel ID listesi gerekli')],
  reorderGalleryAssets
);

export default router;
