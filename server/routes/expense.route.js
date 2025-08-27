import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  createExpenseController,
  getExpenseController,
  getAllExpensesController,
  updateExpenseController,
  deleteExpenseController
} from '../controllers/expense.controller.js';
import {
  createExpenseValidator,
  updateExpenseValidator,
  getExpenseValidator,
  deleteExpenseValidator,
  listExpensesValidator
} from '../validators/expense.validator.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post(
  '/',
  createExpenseValidator,
  validate,
  createExpenseController
);

// @route   GET /api/expenses/:id
// @desc    Get a single expense by ID
// @access  Private
router.get(
  '/:id',
  getExpenseValidator,
  validate,
  getExpenseController
);

// @route   GET /api/expenses
// @desc    Get all expenses for the authenticated user
// @access  Private
router.get(
  '/',
  listExpensesValidator,
  validate,
  getAllExpensesController
);

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put(
  '/:id',
  updateExpenseValidator,
  validate,
  updateExpenseController
);

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete(
  '/:id',
  deleteExpenseValidator,
  validate,
  deleteExpenseController
);

export default router;
