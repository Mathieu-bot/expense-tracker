// validators/expense.validator.js
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
    
  body('frequency')
    .optional()
    .isIn(['MONTHLY', 'YEARLY'])
    .withMessage('Frequency must be either MONTHLY or YEARLY')
    .custom((value, { req }) => {
      if (req.body.type === 'RECURRING' && !value) {
        throw new Error('Frequency is required for recurring expenses');
      }
      return true;
    }),
    
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
    .toDate()
    .custom((value, { req }) => {
      if (req.body.type === 'RECURRING' && !value && !req.body.expense_date) {
        throw new Error('Start date is required for recurring expenses');
      }
      return true;
    }),
    
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .toDate()
    .custom((value, { req }) => {
      if (value && req.body.start_date && new Date(value) < new Date(req.body.start_date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
    
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer')
    .notEmpty()
    .withMessage('Category ID is required'),
    
  body('type').custom((value, { req }) => {
    if (value === 'RECURRING' && !req.body.frequency) {
      throw new Error('Frequency is required for recurring expenses');
    }
    return true;
  })
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
    
  body('frequency')
    .optional()
    .isIn(['MONTHLY', 'YEARLY'])
    .withMessage('Frequency must be either MONTHLY or YEARLY'),
    
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
    .toDate()
    .custom((value, { req }) => {
      if (value && req.body.start_date && new Date(value) < new Date(req.body.start_date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
    
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
    
  body('type').custom((value, { req }) => {
    if (value === 'RECURRING' && req.body.frequency && !['MONTHLY', 'YEARLY'].includes(req.body.frequency)) {
      throw new Error('Frequency must be either MONTHLY or YEARLY for recurring expenses');
    }
    return true;
  })
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
    .withMessage('Type must be either ONE_TIME or RECURRING'),
    
  query('includeUpcoming')
    .optional()
    .isBoolean()
    .withMessage('includeUpcoming must be a boolean')
    .toBoolean()
];