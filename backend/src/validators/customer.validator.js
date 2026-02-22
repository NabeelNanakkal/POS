import { body, param } from 'express-validator';

export const createCustomerValidator = [
  body('name').trim().notEmpty().withMessage('Customer name is required').isLength({ max: 100 }),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
];

export const updateCustomerValidator = [
  param('id').isMongoId().withMessage('Invalid customer ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('phone').optional().trim().notEmpty(),
  body('email').optional().isEmail().withMessage('Invalid email format'),
];

export const loyaltyPointsValidator = [
  param('id').isMongoId().withMessage('Invalid customer ID'),
  body('points').notEmpty().withMessage('Points value is required').isInt().withMessage('Points must be an integer'),
];
