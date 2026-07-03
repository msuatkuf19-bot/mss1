import { Router } from 'express';
import {
  createWaiterCall,
  getWaiterCalls,
  updateWaiterCallStatus,
} from '../controllers/waiter-call.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public endpoint - no auth needed (customers call waiter from QR menu)
router.post('/', createWaiterCall);

// Protected endpoints - restaurant admin or super admin
router.get('/:restaurantId', authenticate, authorize('RESTAURANT_ADMIN', 'SUPER_ADMIN'), getWaiterCalls);
router.patch('/:id/status', authenticate, authorize('RESTAURANT_ADMIN', 'SUPER_ADMIN'), updateWaiterCallStatus);

export default router;
