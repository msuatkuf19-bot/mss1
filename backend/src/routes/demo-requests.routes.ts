import { Router } from 'express';
import {
  createDemoRequest,
  listDemoRequests,
  updateDemoRequestStatus,
} from '../controllers/demo-requests.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public: Landing/Demo form submission
router.post('/', createDemoRequest);

// Super Admin: list & status management
router.get('/', authenticate, authorize('SUPER_ADMIN'), listDemoRequests);
router.patch('/:id/status', authenticate, authorize('SUPER_ADMIN'), updateDemoRequestStatus);

export default router;
