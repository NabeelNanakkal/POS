import express from 'express';
import {
  getDiscounts,
  getActiveDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  incrementUsageCount,
} from '../controllers/discount.controller.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createDiscountValidator, updateDiscountValidator } from '../validators/discount.validator.js';

const router = express.Router();

router.get('/active', getActiveDiscounts);
router.get('/', getDiscounts);
router.get('/:id', getDiscountById);

router.post('/', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), createDiscountValidator, validate, createDiscount);
router.put('/:id', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), updateDiscountValidator, validate, updateDiscount);
router.patch('/:id/usage', authorize('CASHIER', 'MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), incrementUsageCount);
router.delete('/:id', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), deleteDiscount);

export default router;
