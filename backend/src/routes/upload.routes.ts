import { Router } from 'express';
import { uploadImage, deleteImage, getImages } from '../controllers/upload.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Tüm rotalar authentication gerektirir
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'RESTAURANT_ADMIN'));

// Görsel yükle
router.post('/', upload.single('file'), uploadImage);

// Görselleri listele
router.get('/', getImages);

// Görsel sil
router.delete('/:id', deleteImage);

export default router;
