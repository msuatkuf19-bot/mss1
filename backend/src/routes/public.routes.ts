import { Router } from 'express';
import { getPublicMenu, getProductDetail } from '../controllers/public.controller';

const router = Router();

// Public routes (authentication gerekmez)
router.get('/menu/:slug', getPublicMenu);
router.get('/product/:id', getProductDetail);

export default router;
