import { Router } from 'express';
import {
  createQRCode,
  generateQRCode,
  generateBulkQRCodes,
  generateQRPDF,
  getQRCodes,
  scanQRCode,
  updateQRCode,
  deleteQRCode,
  downloadQRCode,
  getQRCodeImage,
} from '../controllers/qr.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Public routes
router.get('/scan/:code', scanQRCode);
router.get('/:id/image', getQRCodeImage); // QR görsel endpoint (public)

// Diğer rotalar authentication gerektirir
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'RESTAURANT_ADMIN'));

// CRUD endpoints
router.post('/', createQRCode); // Create
router.get('/restaurant/:restaurantId', getQRCodes); // Read
router.put('/:id', updateQRCode); // Update
router.delete('/:id', deleteQRCode); // Delete
router.get('/:id/download', downloadQRCode); // Download

// Legacy endpoints
router.post('/generate/:restaurantId?', generateQRCode);

// Toplu QR kod oluştur
router.post(
  '/bulk/:restaurantId?',
  [
    body('startTable').isInt({ min: 1 }).withMessage('Geçerli bir başlangıç masa numarası girin'),
    body('endTable').isInt({ min: 1 }).withMessage('Geçerli bir bitiş masa numarası girin'),
  ],
  validate,
  generateBulkQRCodes
);

// PDF QR kod oluştur
router.post(
  '/pdf/:restaurantId?',
  [body('tableNumbers').isArray().withMessage('Masa numaraları array olmalı')],
  validate,
  generateQRPDF
);

export default router;
