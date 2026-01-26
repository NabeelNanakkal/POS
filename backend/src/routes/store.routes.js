import express from 'express';
import {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  toggleStoreStatus,
  bulkCreateStores
} from '../controllers/storeController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Store routes
router.get('/', getStores);
router.get('/:id', getStoreById);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), createStore);
router.post('/bulk', authorize('ADMIN', 'SUPER_ADMIN'), bulkCreateStores);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), updateStore);
router.patch('/:id/status', authorize('ADMIN', 'SUPER_ADMIN'), toggleStoreStatus);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), deleteStore);

export default router;
