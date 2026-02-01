import express from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  updateLoyaltyPoints,
  updatePurchaseHistory,
} from '../controllers/customerController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Customer routes
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.patch('/:id/loyalty', updateLoyaltyPoints);
router.patch('/:id/purchase', updatePurchaseHistory);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), deleteCustomer);

export default router;
