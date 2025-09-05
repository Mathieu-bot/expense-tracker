import { validationResult } from "express-validator";
import {
  createExpense,
  getExpenseById,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} from "../services/expense.service.js";
import { getMonthlyExpenseSummary } from "../services/report.service.js";

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpenseController = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const userId = req.user.user_id;
    // Build payload using API field names. Service will map to DB fields
    const expenseData = {
      amount: req.body.amount,
      description: req.body.description,
      type: req.body.type || "one-time",
      categoryId: req.body.categoryId,
      date: req.body.date,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      user_id: userId,
      ...(req.file ? { receipt_upload: req.file.path } : {}),
    };

    const result = await createExpense(expenseData);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.status(201).json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error creating expense:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while creating expense" });
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
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching expense:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching expense",
    });
  }
};

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
export const getAllExpensesController = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { start, end, category, type, view, month } = req.query;

    // Support monthly virtualization without a new endpoint
    if (view === "monthly") {
      // Parse month=YYYY-MM or default to current month
      let year, monthIndex;
      if (month && /^\d{4}-\d{2}$/.test(month)) {
        const [y, m] = month.split("-");
        year = parseInt(y, 10);
        monthIndex = parseInt(m, 10) - 1;
      } else {
        const now = new Date();
        year = now.getFullYear();
        monthIndex = now.getMonth();
      }
      const monthStart = new Date(year, monthIndex, 1, 0, 0, 0, 0);
      const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

      const result = await getMonthlyExpenseSummary(userId, monthStart, monthEnd);
      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }
      return res.status(200).json({ success: true, data: result.data });
    }

    const result = await getAllExpenses(userId, {
      start,
      end,
      category,
      type,
    });

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res
      .status(200)
      .json({ success: true, data: result.data, count: result.data.length });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while fetching expenses" });
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
      errors: errors.array(),
    });
  }

  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const updateData = {
      amount: req.body.amount,
      description: req.body.description,
      type: req.body.type,
      categoryId: req.body.categoryId,
      date: req.body.date,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      ...(req.file ? { receipt_upload: req.file.path } : {}),
    };

    const result = await updateExpense(id, userId, updateData);
    if (!result.success) {
      const statusCode = result.error.includes("not found") ? 404 : 400;
      return res
        .status(statusCode)
        .json({ success: false, error: result.error });
    }
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while updating expense" });
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
      const statusCode = result.error.includes("not found") ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        error: result.error,
      });
    }
    // Per OpenAPI spec, return 204 No Content
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while deleting expense",
    });
  }
};
