import express from 'express';
import {
  getPayments,
  getPaymentById,
  createPayment,
  getPaymentStats,
} from '../controllers/payment.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Stats route (before /:id to avoid conflict)
router.get('/statistics', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), getPaymentStats);

// Payment routes
router.get('/', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), getPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);

export default router;
