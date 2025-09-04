import { Prisma } from '@prisma/client';
import { prisma } from "../db/prisma.js";
import { addMonths, addYears } from 'date-fns';

const calculateNextOccurrence = (expense) => {
  if (expense.type !== 'RECURRING' || !expense.frequency) return null;

  const base = expense.expense_date || expense.start_date || new Date();
  let nextDate = null;

  if (expense.frequency === 'MONTHLY') {
    nextDate = addMonths(new Date(base), 1);
  } else if (expense.frequency === 'YEARLY') {
    nextDate = addYears(new Date(base), 1);
  }

  if (expense.end_date && nextDate && new Date(nextDate) > new Date(expense.end_date)) {
    return null;
  }

  return nextDate;
};

export const createExpense = async (expenseData) => {
  try {
    const {
      type = 'ONE_TIME',
      frequency,
      start_date,
      end_date,
      expense_date,
      amount,
      category_id,
      user_id,
      ...rest
    } = expenseData;

    // Normalize primitives
    const normalizedType = type === 'RECURRING' ? 'RECURRING' : 'ONE_TIME';
    const normalizedFrequency = normalizedType === 'RECURRING' ? frequency || 'MONTHLY' : null;
    const normalizedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const normalizedCategoryId = typeof category_id === 'string' ? parseInt(category_id) : category_id;
    const normalizedUserId = typeof user_id === 'string' ? parseInt(user_id) : user_id;

    const expenseDate = normalizedType === 'RECURRING'
      ? new Date(start_date || new Date())
      : expense_date ? new Date(expense_date) : new Date();

    const created = await prisma.expense.create({
      data: {
        ...rest,
        amount: normalizedAmount,
        user_id: normalizedUserId,
        category_id: normalizedCategoryId,
        type: normalizedType,
        frequency: normalizedType === 'RECURRING' ? normalizedFrequency : null,
        expense_date: expenseDate,
        start_date: normalizedType === 'RECURRING' ? (start_date ? new Date(start_date) : expenseDate) : null,
        end_date: normalizedType === 'RECURRING' && end_date ? new Date(end_date) : null,
        last_processed: null,
      },
      include: { category: true },
    });

    return { success: true, data: created };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return { success: false, error: 'Invalid user_id or category_id' };
      }
    }
    console.error('Error in createExpense:', error);
    return { success: false, error: error.message };
  }
};

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
      return { success: false, error: 'Expense not found' };
    }

    return { success: true, data: expense };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllExpenses = async (userId, filters = {}) => {
  try {
    const { startDate, endDate, categoryId, type, includeUpcoming = false } = filters;

    const andConditions = [
      { user_id: parseInt(userId) },
    ];

    if (categoryId) andConditions.push({ category_id: parseInt(categoryId) });

    if (startDate || endDate) {
      const dateRange = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };

      const orConditions = [
        {
          type: 'ONE_TIME',
          expense_date: dateRange,
        },
        {
          type: 'RECURRING',
          start_date: { lte: new Date(endDate || new Date()) },
          OR: [
            { end_date: null },
            { end_date: { gte: new Date(startDate || '1970-01-01') } },
          ],
        },
      ];

      // If explicit type filter provided, constrain OR branches accordingly
      if (type === 'ONE_TIME') {
        orConditions.splice(1, 1); // remove recurring branch
      } else if (type === 'RECURRING') {
        orConditions.splice(0, 1); // remove one-time branch
      }

      andConditions.push({ OR: orConditions });
    } else if (type) {
      andConditions.push({ type });
    }

    const where = { AND: andConditions };

    let expenses = await prisma.expense.findMany({
      where,
      include: { category: true },
      orderBy: { expense_date: 'desc' },
    });

    const now = new Date();
    const expandedExpenses = [];

    for (const expense of expenses) {
      if (expense.type === 'RECURRING' && expense.frequency) {
        // Base row (stored expense) for context
        expandedExpenses.push({ ...expense, is_recurring_instance: false });

        if (includeUpcoming || startDate || endDate) {
          let currentDate = new Date(expense.start_date || expense.expense_date || now);
          const expenseEndDate = expense.end_date ? new Date(expense.end_date) : null;

          let maxDate = now;
          if (includeUpcoming) maxDate = addYears(now, 1);
          if (endDate && new Date(endDate) > maxDate) maxDate = new Date(endDate);

          // Iterate occurrences
          while (currentDate <= maxDate && (!expenseEndDate || currentDate <= expenseEndDate)) {
            // Respect startDate filter
            if (!startDate || currentDate >= new Date(startDate)) {
              // Avoid duplicating the stored base expense_date
              const baseDate = expense.expense_date ? new Date(expense.expense_date) : null;
              const isSameAsBase = baseDate && currentDate.getTime() === baseDate.getTime();
              if (!isSameAsBase) {
                expandedExpenses.push({
                  ...expense,
                  // keep original numeric ID and expose a synthetic instanceId to avoid type issues
                  instance_id: `${expense.expense_id}_${currentDate.getTime()}`,
                  expense_date: new Date(currentDate),
                  is_recurring_instance: true,
                  parent_expense_id: expense.expense_id,
                });
              }
            }

            if (expense.frequency === 'MONTHLY') {
              currentDate = addMonths(currentDate, 1);
            } else if (expense.frequency === 'YEARLY') {
              currentDate = addYears(currentDate, 1);
            } else {
              break;
            }
          }
        }
      } else {
        expandedExpenses.push(expense);
      }
    }

    expenses = expandedExpenses.sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date));

    return { success: true, data: expenses };
  } catch (error) {
    console.error('Error in getAllExpenses:', error);
    return { success: false, error: error.message };
  }
};

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
    const allowedFields = [
      'amount', 'description', 'type', 'receipt_upload', 
      'expense_date', 'start_date', 'end_date', 'category_id',
      'frequency', 'last_processed'
    ];
    
    // Handle type changes and related fields
    if (updateData.type && updateData.type !== existingExpense.type) {
      if (updateData.type === 'RECURRING') {
        dataToUpdate.type = 'RECURRING';
        dataToUpdate.frequency = updateData.frequency && ['MONTHLY', 'YEARLY'].includes(updateData.frequency)
          ? updateData.frequency
          : 'MONTHLY';
        // Start date: if provided, use it; otherwise default to now
        if ('start_date' in updateData) {
          dataToUpdate.start_date = updateData.start_date ? new Date(updateData.start_date) : new Date();
        } else {
          dataToUpdate.start_date = new Date();
        }
        // End date: if provided, use it; otherwise null
        if ('end_date' in updateData) {
          dataToUpdate.end_date = updateData.end_date ? new Date(updateData.end_date) : null;
        } else {
          dataToUpdate.end_date = null;
        }
      } else if (updateData.type === 'ONE_TIME') {
        dataToUpdate.type = 'ONE_TIME';
        dataToUpdate.frequency = null;
        dataToUpdate.start_date = null;
        dataToUpdate.end_date = null;
      }
    } else if (updateData.type) {
      // No change but explicit set
      dataToUpdate.type = updateData.type;
    }
    
    // Handle frequency changes
    if (updateData.frequency && updateData.frequency !== existingExpense.frequency) {
      if (!['MONTHLY', 'YEARLY'].includes(updateData.frequency)) {
        return { 
          success: false, 
          error: 'Frequency must be either MONTHLY or YEARLY for recurring expenses' 
        };
      }
      dataToUpdate.frequency = updateData.frequency;
    }

    // Handle other fields
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        // Handle date fields
        if (key.endsWith('_date') && updateData[key]) {
          dataToUpdate[key] = new Date(updateData[key]);
        } else if (key === 'amount') {
          dataToUpdate.amount = typeof updateData.amount === 'string' ? parseFloat(updateData.amount) : updateData.amount;
        } else if (key === 'category_id') {
          dataToUpdate.category_id = typeof updateData.category_id === 'string' ? parseInt(updateData.category_id) : updateData.category_id;
        } else if (key !== 'type' && key !== 'frequency') { // Already handled above
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

    // Do not auto-increment expense_date on update. It should only change if explicitly provided.

    return { success: true, data: updatedExpense };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'Expense not found' };
      }
      if (error.code === 'P2003') {
        return { success: false, error: 'Invalid category_id' };
      }
    }
    console.error('Error in updateExpense:', error);
    return { success: false, error: error.message };
  }
};

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

    await prisma.expense.delete({
      where: {
        expense_id: parseInt(expenseId),
      },
    });

    return { success: true, data: { id: expenseId } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return { success: false, error: 'Expense not found' };
    }
    console.error('Error in deleteExpense:', error);
    return { success: false, error: error.message };
  }
};