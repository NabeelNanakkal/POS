import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  bulkCreateEmployees,
  updateEmployee,
  deleteEmployee,
  resetEmployeePassword,
} from '../controllers/employeeController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// All employee routes require Manager, Admin, or Super Admin role
router.use(authorize('MANAGER', 'ADMIN', 'SUPER_ADMIN'));

// Employee routes
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), createEmployee);
router.post('/bulk', authorize('ADMIN', 'SUPER_ADMIN'), bulkCreateEmployees);
router.put('/action/reset-password/:id', authorize('ADMIN', 'SUPER_ADMIN'), resetEmployeePassword);
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN'), updateEmployee);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), deleteEmployee);

export default router;
