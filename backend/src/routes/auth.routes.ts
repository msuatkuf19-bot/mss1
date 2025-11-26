import { Router } from 'express';
import { register, login, getProfile, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Kayıt
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Geçerli bir email girin'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
    body('name').notEmpty().withMessage('İsim gerekli'),
  ],
  register
);

// Giriş
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Geçerli bir email girin'),
    body('password').notEmpty().withMessage('Şifre gerekli'),
  ],
  login
);

// Token yenileme
router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token gerekli')],
  refreshToken
);

// Profil
router.get('/profile', authenticate, getProfile);

export default router;
