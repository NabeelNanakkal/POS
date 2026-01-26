import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Public category routes (for all authenticated users)
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes (Manager, Admin, Super Admin)
router.post('/', authorize('MANAGER', 'ADMIN', 'SUPER_ADMIN'), createCategory);
router.put('/:id', authorize('MANAGER', 'ADMIN', 'SUPER_ADMIN'), updateCategory);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), deleteCategory);

export default router;
