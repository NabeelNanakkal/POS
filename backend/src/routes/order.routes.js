import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  refundOrder,
  getOrderStats,
  getTopSellingItems,
} from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Stats route (before /:id to avoid conflict)
router.get('/stats', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), getOrderStats);

// Order routes
router.get('/top-selling', getTopSellingItems);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/status', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), updateOrderStatus);
router.post('/:id/refund', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), refundOrder);

export default router;
