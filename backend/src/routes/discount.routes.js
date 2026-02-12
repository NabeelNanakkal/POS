import express from 'express';
import {
  getDiscounts,
  getActiveDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  incrementUsageCount,
} from '../controllers/discountController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Active discounts route (before /:id to avoid conflict)
router.get('/active', getActiveDiscounts);

// Discount routes
router.get('/', getDiscounts);
router.get('/:id', getDiscountById);
router.post('/', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), createDiscount);
router.put('/:id', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), updateDiscount);
router.patch('/:id/usage', authorize('CASHIER', 'MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), incrementUsageCount);
router.delete('/:id', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), deleteDiscount);

export default router;
