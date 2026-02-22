import { body, param } from 'express-validator';

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 200 }),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').notEmpty().withMessage('Category is required').isMongoId().withMessage('Invalid category ID'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('reorderPoint').optional().isInt({ min: 0 }).withMessage('Reorder point must be a non-negative integer'),
];

export const updateProductValidator = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 200 }),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

export const adjustStockValidator = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('quantity').notEmpty().withMessage('Quantity is required').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('type').notEmpty().withMessage('Type is required').isIn(['add', 'remove']).withMessage('Type must be "add" or "remove"'),
  body('reason').optional().trim().isLength({ max: 500 }),
];
