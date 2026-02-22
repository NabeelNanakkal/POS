import { body, param } from 'express-validator';

export const createEmployeeValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('username').optional().trim().notEmpty().withMessage('Username cannot be empty'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('role')
    .optional()
    .isIn(['MANAGER', 'CASHIER', 'INVENTORY_MANAGER', 'ACCOUNTANT'])
    .withMessage('Invalid role'),
  body('password').optional().isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
];

export const updateEmployeeValidator = [
  param('id').isMongoId().withMessage('Invalid employee ID'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('role')
    .optional()
    .isIn(['MANAGER', 'CASHIER', 'INVENTORY_MANAGER', 'ACCOUNTANT'])
    .withMessage('Invalid role'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
];

export const resetPasswordValidator = [
  param('id').isMongoId().withMessage('Invalid employee ID'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
];
