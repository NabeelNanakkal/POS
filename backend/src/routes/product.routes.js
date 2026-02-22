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
  adjustStock,
} from '../controllers/product.controller.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProductValidator,
  updateProductValidator,
  adjustStockValidator,
} from '../validators/product.validator.js';

const router = express.Router();

router.get('/low-stock', getLowStockProducts);
router.get('/stats', getProductStats);
router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/bulk', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), bulkCreateProducts);
router.post('/', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), createProductValidator, validate, createProduct);
router.put('/adjust-stock/:id', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), adjustStockValidator, validate, adjustStock);
router.put('/:id', authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'), updateProductValidator, validate, updateProduct);
router.delete('/:id', authorize('STORE_ADMIN', 'SUPER_ADMIN'), deleteProduct);

export default router;
