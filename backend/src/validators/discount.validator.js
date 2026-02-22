import { body, param } from 'express-validator';

export const createDiscountValidator = [
  body('name').trim().notEmpty().withMessage('Discount name is required'),
  body('code').trim().notEmpty().withMessage('Discount code is required'),
  body('type').notEmpty().withMessage('Discount type is required').isIn(['PERCENTAGE', 'FIXED_AMOUNT']).withMessage('Type must be PERCENTAGE or FIXED_AMOUNT'),
  body('value').notEmpty().withMessage('Discount value is required').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('validFrom').notEmpty().withMessage('Valid from date is required').isISO8601().withMessage('Invalid date format'),
  body('validTo').notEmpty().withMessage('Valid to date is required').isISO8601().withMessage('Invalid date format'),
  body('minPurchaseAmount').optional().isFloat({ min: 0 }),
  body('usageLimit').optional().isInt({ min: 1 }).withMessage('Usage limit must be at least 1'),
];

export const updateDiscountValidator = [
  param('id').isMongoId().withMessage('Invalid discount ID'),
  body('type').optional().isIn(['PERCENTAGE', 'FIXED_AMOUNT']).withMessage('Type must be PERCENTAGE or FIXED_AMOUNT'),
  body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('validFrom').optional().isISO8601().withMessage('Invalid date format'),
  body('validTo').optional().isISO8601().withMessage('Invalid date format'),
];
