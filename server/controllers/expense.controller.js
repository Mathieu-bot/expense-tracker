import { validationResult } from 'express-validator';
import {
  createExpense,
  getExpenseById,
  getAllExpenses,
  updateExpense,
  deleteExpense
} from '../services/expense.service.js';

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpenseController = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const userId = req.user.user_id;
    const expenseData = {
      ...req.body,
      user_id: userId
    };

    const result = await createExpense(expenseData);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }

    return res.status(201).json({ 
      success: true, 
      data: result.data 
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while creating expense' 
    });
  }
};

// @desc    Get a single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const result = await getExpenseById(id, userId);
    
    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        error: result.error 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: result.data 
    });
  } catch (error) {
    console.error('Error fetching expense:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching expense' 
    });
  }
};

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
export const getAllExpensesController = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { startDate, endDate, categoryId, type, includeUpcoming } = req.query;

    const result = await getAllExpenses(userId, { 
      startDate, 
      endDate, 
      categoryId, 
      type,
      includeUpcoming,
    });

    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: result.data,
      count: result.data.length
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching expenses' 
    });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpenseController = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const updateData = req.body;

    // Don't allow updating user_id
    if (updateData.user_id) {
      delete updateData.user_id;
    }

    const result = await updateExpense(id, userId, updateData);
    
    if (!result.success) {
      const statusCode = result.error.includes('not found') ? 404 : 400;
      return res.status(statusCode).json({ 
        success: false, 
        error: result.error 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: result.data 
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while updating expense' 
    });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpenseController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const result = await deleteExpense(id, userId);
    
    if (!result.success) {
      const statusCode = result.error.includes('not found') ? 404 : 400;
      return res.status(statusCode).json({ 
        success: false, 
        error: result.error 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: { id } 
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error while deleting expense' 
    });
  }
};
