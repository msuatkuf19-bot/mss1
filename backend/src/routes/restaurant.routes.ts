import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurant,
} from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Tüm rotalar authentication gerektirir
router.use(authenticate);

// Süper Admin - Tüm restoranlar
router.get('/', authorize('SUPER_ADMIN'), getAllRestaurants);

// Restoran Admin - Kendi restoranı
router.get('/my-restaurant', authorize('RESTAURANT_ADMIN'), getMyRestaurant);

// Tek restoran detayı
router.get('/:id', getRestaurant);

// Yeni restoran oluştur (Süper Admin)
router.post(
  '/',
  authorize('SUPER_ADMIN'),
  [
    body('name').notEmpty().withMessage('Restoran adı gerekli'),
    body('slug').notEmpty().withMessage('Slug gerekli'),
    body('ownerEmail').isEmail().withMessage('Geçerli bir email girin'),
    body('ownerName').notEmpty().withMessage('Owner adı gerekli'),
    body('ownerPassword').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
  ],
  createRestaurant
);

// Restoran güncelle
router.put('/:id', authorize('SUPER_ADMIN', 'RESTAURANT_ADMIN'), updateRestaurant);

// Restoran sil (Süper Admin)
router.delete('/:id', authorize('SUPER_ADMIN'), deleteRestaurant);

export default router;
