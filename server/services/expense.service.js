import { Prisma } from '@prisma/client';
import { prisma } from "../db/prisma.js";

//Post

export const createExpense = async (userId,expenseData) => {
  try {
    const expense = await prisma.expense.create({
      data: {
        amount: expenseData.amount,
        description: expenseData.description,
        type: expenseData.type || 'ONE_TIME',
        receipt_upload: expenseData.receipt_upload,
        expense_date: expenseData.expense_date ? new Date(expenseData.expense_date) : null,
        start_date: expenseData.start_date ? new Date(expenseData.start_date) : null,
        end_date: expenseData.end_date ? new Date(expenseData.end_date) : null,
        user_id: expenseData.user_id,
        category_id: expenseData.category_id,
        user: {connect:{ user_id: userId}}
      },
      include: {
        category: true,
      },
    });
    return { success: true, data: expense };
  } catch (error) {
    return {success: false, error: error} 
 }
};

//Get by id

export const getExpenseById = async (expenseId, userId) => {
  try {
    const expense = await prisma.expense.findFirst({
      where: {
        expense_id: parseInt(expenseId),
        user_id: userId,
      },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return { success: false, error: 'Expense not found' };
    }

    return { success: true, data: expense };
  } catch (error) {
    return { success: false, error: error };
  }
};

//Get all

export const getAllExpenses = async (userId, filters = {}) => {
  try {
    const { startDate, endDate, categoryId, type } = filters;
    
    const where = {
      user_id: parseInt(userId)
    };

    if (startDate || endDate) {
      where.expense_date = {};
      if (startDate) where.expense_date.gte = new Date(startDate);
      if (endDate) where.expense_date.lte = new Date(endDate);
    }

    if (categoryId) where.category_id = parseInt(categoryId);
    if (type) where.type = type;

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        expense_date: 'desc',
      },
    });

    return { success: true, data: expenses };
  } catch (error) {
    return { success: false, error: error};
  }
};

//Update expense

export const updateExpense = async (expenseId, userId, updateData) => {
  try {
    // First verify the expense exists and belongs to the user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        expense_id: parseInt(expenseId),
        user_id: parseInt(userId),
      },
    });

    if (!existingExpense) {
      return { success: false, error: 'Expense not found or access denied' };
    }

    // Prepare the data to update
    const dataToUpdate = {};
    const allowedFields = ['amount', 'description', 'type', 'receipt_upload', 'expense_date', 'start_date', 'end_date', 'category_id'];
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        // Handle date fields
        if (key.endsWith('_date') && updateData[key]) {
          dataToUpdate[key] = new Date(updateData[key]);
        } else {
          dataToUpdate[key] = updateData[key];
        }
      }
    });

    const updatedExpense = await prisma.expense.update({
      where: {
        expense_id: parseInt(expenseId),
      },
      data: dataToUpdate,
      include: {
        category: true,
      },
    });

    return { success: true, data: updatedExpense };
  } catch (error) {
    return { success: false, error: error };
  }
};

//Delete

export const deleteExpense = async (expenseId, userId) => {
  try {
    // First verify the expense exists and belongs to the user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        expense_id: parseInt(expenseId),
        user_id: parseInt(userId),
      },
    });

    if (!existingExpense) {
      return { success: false, error: 'Expense not found or access denied' };
    }

    const deletedExpense = await prisma.expense.delete({
      where: {
        expense_id: parseInt(expenseId),
      },
    });

    return { success: true, data: deletedExpense};
  } catch (error) {
   return { success: false, error: error};
  }
};

