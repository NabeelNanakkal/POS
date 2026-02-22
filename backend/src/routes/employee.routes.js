import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  bulkCreateEmployees,
  updateEmployee,
  deleteEmployee,
  resetEmployeePassword,
} from '../controllers/employee.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// All employee routes require Manager, Admin, or Super Admin role
router.use(authorize('MANAGER', 'STORE_ADMIN', 'SUPER_ADMIN'));

// Employee routes
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('STORE_ADMIN', 'SUPER_ADMIN'), createEmployee);
router.post('/bulk', authorize('STORE_ADMIN', 'SUPER_ADMIN'), bulkCreateEmployees);
router.put('/action/reset-password/:id', authorize('STORE_ADMIN', 'SUPER_ADMIN'), resetEmployeePassword);
router.put('/:id', authorize('STORE_ADMIN', 'SUPER_ADMIN'), updateEmployee);
router.delete('/:id', authorize('STORE_ADMIN', 'SUPER_ADMIN'), deleteEmployee);

export default router;
