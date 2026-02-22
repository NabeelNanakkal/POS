import { body, param } from 'express-validator';

export const createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
  body('items.*.price').optional().isFloat({ min: 0 }).withMessage('Item price must be a positive number'),
  body('payments').isArray({ min: 1 }).withMessage('At least one payment method is required'),
  body('payments.*.method').notEmpty().withMessage('Payment method is required'),
  body('payments.*.amount').isFloat({ min: 0 }).withMessage('Payment amount must be a positive number'),
  body('customer').optional().isMongoId().withMessage('Invalid customer ID'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number'),
];

export const updateOrderStatusValidator = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED'])
    .withMessage('Invalid order status'),
];
