/**
 * User Example Routes
 * 
 * Railway deployment testi için hazırlanmış basit CRUD endpoint'leri
 * Gerçek user yönetimi için /api/users ve /api/auth route'larını kullanın
 */

import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  testDatabaseConnection
} from '../controllers/user-example.controller';

const router = express.Router();

/**
 * Veritabanı bağlantı testi
 * GET /api/users/example/test-connection
 */
router.get('/test-connection', testDatabaseConnection);

/**
 * Tüm kullanıcıları listele
 * GET /api/users/example
 */
router.get('/', getAllUsers);

/**
 * Tek kullanıcı detayı
 * GET /api/users/example/:id
 */
router.get('/:id', getUserById);

/**
 * Yeni kullanıcı oluştur (Basitleştirilmiş)
 * POST /api/users/example
 * 
 * Body: { email, name, password }
 */
router.post('/', createUser);

/**
 * Kullanıcı güncelle
 * PUT /api/users/example/:id
 * 
 * Body: { name?, isActive? }
 */
router.put('/:id', updateUser);

/**
 * Kullanıcı sil
 * DELETE /api/users/example/:id
 */
router.delete('/:id', deleteUser);

export default router;
