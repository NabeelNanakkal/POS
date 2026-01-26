import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  bulkCreateProducts,
  getProductStats,
  adjustStock
} from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get low stock products (before /:id to avoid route conflict)
router.get('/low-stock', getLowStockProducts);

// Get product stats
router.get('/stats', getProductStats);

// Bulk create products
router.post('/bulk', authorize('MANAGER', 'ADMIN', 'SUPER_ADMIN'), bulkCreateProducts);

// Public product routes (for all authenticated users)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Manager, Admin, Super Admin)
router.post('/', authorize('MANAGER', 'ADMIN', 'SUPER_ADMIN'), createProduct);
router.put('/:id', authorize('MANAGER', 'ADMIN', 'SUPER_ADMIN'), updateProduct);
router.put('/adjust-stock/:id', authorize('MANAGER', 'ADMIN', 'SUPER_ADMIN'), adjustStock);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), deleteProduct);

export default router;
