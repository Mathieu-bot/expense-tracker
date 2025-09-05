import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";

/**
 * Create a new expense
 * @param {Object} expenseData - The expense data
 * @returns {Promise<Object>} Result object with success status and data/error
 */
export const createExpense = async (expenseData) => {
  try {
    const {
      amount,
      date,
      categoryId,
      description,
      type = "one-time",
      startDate,
      endDate,
      receipt_upload,
      user_id, // from controller
      ...rest
    } = expenseData;

    // Convert amount to float
    const normalizedAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    // Map API type to DB type
    const dbType = type === "recurring" ? "RECURRING" : "ONE_TIME";

    // Validate required fields based on type
    if (type === "one-time" && !date) {
      return {
        success: false,
        error: "Date is required for one-time expenses",
      };
    }
    if (type === "recurring" && !startDate) {
      return {
        success: false,
        error: "Start date is required for recurring expenses",
      };
    }

    const created = await prisma.expense.create({
      data: {
        ...rest,
        amount: normalizedAmount,
        description,
        user_id: parseInt(user_id),
        category_id: parseInt(categoryId),
        type: dbType,
        expense_date: type === "one-time" ? new Date(date) : null,
        start_date: type === "recurring" ? new Date(startDate) : null,
        end_date: endDate ? new Date(endDate) : null,
        receipt_upload,
      },
      include: { category: true },
    });

    // Transform response to match API format (avoid duplicate snake_case + camelCase)
    const response = {
      expense_id: created.expense_id,
      amount: created.amount,
      description: created.description,
      type: created.type === "RECURRING" ? "recurring" : "one-time",
      receipt_upload: created.receipt_upload,
      date: created.expense_date,
      startDate: created.start_date,
      endDate: created.end_date,
      last_processed: created.last_processed,
      user_id: created.user_id,
      categoryId: created.category_id,
      category: created.category,
    };

    return { success: true, data: response };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return { success: false, error: "Invalid categoryId" };
      }
    }
    console.error("Error in createExpense:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get an expense by ID
 * @param {string|number} expenseId - The expense ID
 * @param {string|number} userId - The user ID
 * @returns {Promise<Object>} Result object with success status and data/error
 */
export const getExpenseById = async (expenseId, userId) => {
  try {
    const expense = await prisma.expense.findFirst({
      where: {
        expense_id: parseInt(expenseId),
        user_id: parseInt(userId),
      },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return { success: false, error: "Expense not found" };
    }

    // Transform response to match API format (avoid duplicate snake_case + camelCase)
    const response = {
      expense_id: expense.expense_id,
      amount: expense.amount,
      description: expense.description,
      type: expense.type === "RECURRING" ? "recurring" : "one-time",
      receipt_upload: expense.receipt_upload,
      date: expense.expense_date,
      startDate: expense.start_date,
      endDate: expense.end_date,
      last_processed: expense.last_processed,
      user_id: expense.user_id,
      categoryId: expense.category_id,
      category: expense.category,
    };

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all expenses with filters
 * @param {string|number} userId - The user ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Result object with success status and data/error
 */
export const getAllExpenses = async (userId, filters = {}) => {
  try {
    const { start, end, category, type } = filters;

    const where = {
      user_id: parseInt(userId),
      AND: [],
    };

    // Apply category filter by category name
    if (category) {
      where.AND.push({
        category: {
          category_name: category,
        },
      });
    }

    // Apply date range filter and type filter respecting behaviors
    if (start || end) {
      const dateRange = {
        ...(start ? { gte: new Date(start) } : {}),
        ...(end ? { lte: new Date(end) } : {}),
      };

      let orConditions = [
        { type: "ONE_TIME", expense_date: dateRange },
        {
          type: "RECURRING",
          start_date: { lte: new Date(end || new Date()) },
          OR: [
            { end_date: null },
            { end_date: { gte: new Date(start || "1970-01-01") } },
          ],
        },
      ];

      // Apply type filter if specified without reassigning const
      if (type) {
        const dbType = type === "recurring" ? "RECURRING" : "ONE_TIME";
        orConditions = orConditions.filter((condition) => condition.type === dbType);
      }

      where.AND.push({ OR: orConditions });
    } else if (type) {
      where.AND.push({ type: type === "recurring" ? "RECURRING" : "ONE_TIME" });
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: { category: true },
      orderBy: [
        { expense_date: "asc" },
        { creation_date: "asc" },
        { start_date: "asc" },
      ],
    });

    // Transform response to match API format (avoid duplicate snake_case + camelCase)
    const response = expenses.map((expense) => ({
      expense_id: expense.expense_id,
      amount: expense.amount,
      description: expense.description,
      type: expense.type === "RECURRING" ? "recurring" : "one-time",
      receipt_upload: expense.receipt_upload,
      date: expense.expense_date,
      startDate: expense.start_date,
      endDate: expense.end_date,
      last_processed: expense.last_processed,
      user_id: expense.user_id,
      categoryId: expense.category_id,
      category: expense.category,
    }));

    return { success: true, data: response };
  } catch (error) {
    console.error("Error in getAllExpenses:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update an expense
 * @param {string|number} expenseId - The expense ID
 * @param {string|number} userId - The user ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} Result object with success status and data/error
 */
export const updateExpense = async (expenseId, userId, updateData) => {
  try {
    const existingExpense = await prisma.expense.findFirst({
      where: {
        expense_id: parseInt(expenseId),
        user_id: parseInt(userId),
      },
    });

    if (!existingExpense) {
      return { success: false, error: "Expense not found or access denied" };
    }

    const {
      amount,
      date,
      categoryId,
      description,
      type,
      startDate,
      endDate,
      receipt_upload,
    } = updateData;

    const data = {
      ...(amount !== undefined && {
        amount: typeof amount === "string" ? parseFloat(amount) : amount,
      }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { category_id: parseInt(categoryId) }),
      ...(receipt_upload !== undefined && { receipt_upload }),
    };

    if (type === "one-time") {
      data.type = "ONE_TIME";
      data.expense_date = date ? new Date(date) : null;
      data.start_date = null;
      data.end_date = null;
    } else if (type === "recurring") {
      data.type = "RECURRING";
      data.start_date = startDate ? new Date(startDate) : null;
      data.end_date = endDate ? new Date(endDate) : null;
      data.expense_date = null;
    }

    const updatedExpense = await prisma.expense.update({
      where: {
        expense_id: parseInt(expenseId),
      },
      data,
      include: {
        category: true,
      },
    });

    // Transform response to match API format (avoid duplicate snake_case + camelCase)
    const response = {
      expense_id: updatedExpense.expense_id,
      amount: updatedExpense.amount,
      description: updatedExpense.description,
      type: updatedExpense.type === "RECURRING" ? "recurring" : "one-time",
      receipt_upload: updatedExpense.receipt_upload,
      date: updatedExpense.expense_date,
      startDate: updatedExpense.start_date,
      endDate: updatedExpense.end_date,
      last_processed: updatedExpense.last_processed,
      user_id: updatedExpense.user_id,
      categoryId: updatedExpense.category_id,
      category: updatedExpense.category,
    };

    return { success: true, data: response };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { success: false, error: "Expense not found" };
      }
      if (error.code === "P2003") {
        return { success: false, error: "Invalid categoryId" };
      }
    }
    console.error("Error in updateExpense:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete an expense
 * @param {string|number} expenseId - The expense ID
 * @param {string|number} userId - The user ID
 * @returns {Promise<Object>} Result object with success status and data/error
 */
export const deleteExpense = async (expenseId, userId) => {
  try {
    const existingExpense = await prisma.expense.findFirst({
      where: {
        expense_id: parseInt(expenseId),
        user_id: parseInt(userId),
      },
    });

    if (!existingExpense) {
      return { success: false, error: "Expense not found or access denied" };
    }

    await prisma.expense.delete({
      where: {
        expense_id: parseInt(expenseId),
      },
    });

    return { success: true, data: { id: expenseId } };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Expense not found" };
    }
    console.error("Error in deleteExpense:", error);
    return { success: false, error: error.message };
  }
};
