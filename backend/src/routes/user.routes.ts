import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Tüm rotalar authenticate gerektiriyor
router.use(authenticate);

// Kullanıcı istatistikleri (Süper Admin)
router.get('/stats', authorize('SUPER_ADMIN'), getUserStats);

// Tüm kullanıcıları listele (Süper Admin)
router.get('/', authorize('SUPER_ADMIN'), getAllUsers);

// Kullanıcı detayı (Süper Admin)
router.get('/:id', authorize('SUPER_ADMIN'), getUser);

// Yeni kullanıcı oluştur (Süper Admin)
router.post(
  '/',
  authorize('SUPER_ADMIN'),
  [
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('name').trim().notEmpty().withMessage('İsim gereklidir'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
    body('role').optional().isIn(['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'CUSTOMER']).withMessage('Geçersiz rol'),
  ],
  createUser
);

// Kullanıcı güncelle (Süper Admin)
router.put(
  '/:id',
  authorize('SUPER_ADMIN'),
  [
    body('email').optional().isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('name').optional().trim().notEmpty().withMessage('İsim boş olamaz'),
    body('role').optional().isIn(['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'CUSTOMER']).withMessage('Geçersiz rol'),
    body('isActive').optional().isBoolean().withMessage('isActive boolean olmalıdır'),
  ],
  updateUser
);

// Kullanıcı sil (Süper Admin)
router.delete('/:id', authorize('SUPER_ADMIN'), deleteUser);

export default router;
