import { body, param, query } from 'express-validator';

export const createExpenseValidator = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number')
    .notEmpty()
    .withMessage('Amount is required'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
    
  body('type')
    .optional()
    .isIn(['ONE_TIME', 'RECURRING'])
    .withMessage('Type must be either ONE_TIME or RECURRING'),
    
  body('receipt_upload')
    .optional()
    .isString()
    .withMessage('Receipt upload must be a string')
    .isURL()
    .withMessage('Receipt upload must be a valid URL'),
    
  body('expense_date')
    .optional()
    .isISO8601()
    .withMessage('Expense date must be a valid date')
    .toDate(),
    
  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),
    
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .toDate(),
    
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer')
    .notEmpty()
    .withMessage('Category ID is required'),
];

export const updateExpenseValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Expense ID must be a positive integer')
    .toInt(),
    
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
    
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
    
  body('type')
    .optional()
    .isIn(['ONE_TIME', 'RECURRING'])
    .withMessage('Type must be either ONE_TIME or RECURRING'),
    
  body('receipt_upload')
    .optional()
    .isString()
    .withMessage('Receipt upload must be a string')
    .isURL()
    .withMessage('Receipt upload must be a valid URL'),
    
  body('expense_date')
    .optional()
    .isISO8601()
    .withMessage('Expense date must be a valid date')
    .toDate(),
    
  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .toDate(),
    
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .toDate(),
    
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer')
];

export const getExpenseValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Expense ID must be a positive integer')
    .toInt()
];

export const deleteExpenseValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Expense ID must be a positive integer')
    .toInt()
];

export const listExpensesValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
    
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
    
  query('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer')
    .toInt(),
    
  query('type')
    .optional()
    .isIn(['ONE_TIME', 'RECURRING'])
    .withMessage('Type must be either ONE_TIME or RECURRING')
];
