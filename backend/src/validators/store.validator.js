import { body, param } from 'express-validator';

export const createStoreValidator = [
  body('name').trim().notEmpty().withMessage('Store name is required').isLength({ max: 200 }),
  body('code').trim().notEmpty().withMessage('Store code is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().trim().notEmpty(),
  body('country').optional().isMongoId().withMessage('Invalid country ID'),
];

export const updateStoreValidator = [
  param('id').isMongoId().withMessage('Invalid store ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 200 }),
  body('email').optional().isEmail().withMessage('Invalid email format'),
];
