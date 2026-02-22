import { body, param } from 'express-validator';

export const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('parent').optional().isMongoId().withMessage('Invalid parent category ID'),
];

export const updateCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('parent').optional().isMongoId().withMessage('Invalid parent category ID'),
];
