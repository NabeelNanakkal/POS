import { body } from 'express-validator';

export const openShiftValidator = [
  body('openingBalance')
    .notEmpty().withMessage('Opening balance is required')
    .isFloat({ min: 0 }).withMessage('Opening balance must be a positive number'),
];

export const closeShiftValidator = [
  body('closingBalance').optional().isFloat({ min: 0 }).withMessage('Closing balance must be a positive number'),
];

export const startBreakValidator = [
  body('type').optional().isIn(['LUNCH', 'SHORT', 'OTHER']).withMessage('Break type must be LUNCH, SHORT, or OTHER'),
];
