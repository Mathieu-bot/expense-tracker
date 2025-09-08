import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";

// Config fichiers
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]);

async function saveOrReplaceReceipt({ expenseId, userId, file }) {
  if (!file) return null;

  if (!ALLOWED.has(file.mimetype)) {
    throw new Error(`Unhandled file type: ${file.mimetype}`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(
      `File too large (> 5 Mo): ${(file.size / 1024 / 1024).toFixed(2)} Mo`
    );
  }
  if (!file.buffer) {
    throw new Error(
      "No buffer found."
    );
  }

  const sha256 = crypto.createHash("sha256").update(file.buffer).digest("hex");

  const receipt = await prisma.receipt.upsert({
    where: { expense_id: parseInt(expenseId) },
    update: {
      filename: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      bytes: file.buffer,
      sha256,
      user_id: parseInt(userId),
    },
    create: {
      expense_id: parseInt(expenseId),
      user_id: parseInt(userId),
      filename: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      bytes: file.buffer,
      sha256,
    },
    select: {
      receipt_id: true,
      filename: true,
      mime_type: true,
      size: true,
      creation_date: true,
    },
  });

  return receipt;
}

/**
 * Create a new expense (+ optional receipt upload)
 */
export const createExpense = async (expenseData, receiptFile = null) => {
  try {
    const {
      amount,
      date,
      categoryId,
      description,
      type = "one-time",
      startDate,
      endDate,
      user_id,
      ...rest
    } = expenseData;

    const normalizedAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    const dbType = type === "recurring" ? "RECURRING" : "ONE_TIME";

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
      },
      include: {
        category: true,
        receipt: { select: { receipt_id: true } },
      },
    });

    let receiptMeta = null;
    if (receiptFile) {
      receiptMeta = await saveOrReplaceReceipt({
        expenseId: created.expense_id,
        userId: user_id,
        file: receiptFile,
      });
    }

    const response = {
      expense_id: created.expense_id,
      amount: created.amount,
      description: created.description,
      type: created.type === "RECURRING" ? "recurring" : "one-time",
      date: created.expense_date,
      startDate: created.start_date,
      endDate: created.end_date,
      last_processed: created.last_processed,
      user_id: created.user_id,
      categoryId: created.category_id,
      category: created.category,
      receipt:
        receiptMeta ||
        (created.receipt ? { receipt_id: created.receipt.receipt_id } : null),
      has_receipt: Boolean(receiptMeta || created.receipt),
    };

    return { success: true, data: response };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003")
        return { success: false, error: "Invalid categoryId" };
      if (
        error.code === "P2002" &&
        String(error.meta?.target || "").includes("sha256")
      )
        return {
          success: false,
          error: "Duplicate receipt file (sha256 unique)",
        };
    }
    console.error("Error in createExpense:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get an expense by ID (with receipt meta)
 */
export const getExpenseById = async (expenseId, userId) => {
  try {
    const expense = await prisma.expense.findFirst({
      where: { expense_id: parseInt(expenseId), user_id: parseInt(userId) },
      include: {
        category: true,
        receipt: {
          select: {
            receipt_id: true,
            filename: true,
            mime_type: true,
            size: true,
          },
        },
      },
    });

    if (!expense) return { success: false, error: "Expense not found" };

    const response = {
      expense_id: expense.expense_id,
      amount: expense.amount,
      description: expense.description,
      type: expense.type === "RECURRING" ? "recurring" : "one-time",
      date: expense.expense_date,
      startDate: expense.start_date,
      endDate: expense.end_date,
      last_processed: expense.last_processed,
      user_id: expense.user_id,
      categoryId: expense.category_id,
      category: expense.category,
      receipt: expense.receipt || null,
      has_receipt: Boolean(expense.receipt),
    };

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all expenses (with has_receipt flag)
 */
export const getAllExpenses = async (userId, filters = {}) => {
  try {
    const { start, end, category, type } = filters;

    const where = { user_id: parseInt(userId), AND: [] };

    if (category) {
      where.AND.push({ category: { category_name: category } });
    }

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

      if (type) {
        const dbType = type === "recurring" ? "RECURRING" : "ONE_TIME";
        orConditions = orConditions.filter((c) => c.type === dbType);
      }

      where.AND.push({ OR: orConditions });
    } else if (type) {
      where.AND.push({ type: type === "recurring" ? "RECURRING" : "ONE_TIME" });
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
        receipt: { select: { receipt_id: true } },
      },
      orderBy: [
        { expense_date: "asc" },
        { creation_date: "asc" },
        { start_date: "asc" },
      ],
    });

    const response = expenses.map((e) => ({
      expense_id: e.expense_id,
      amount: e.amount,
      description: e.description,
      type: e.type === "RECURRING" ? "recurring" : "one-time",
      date: e.expense_date,
      startDate: e.start_date,
      endDate: e.end_date,
      last_processed: e.last_processed,
      user_id: e.user_id,
      categoryId: e.category_id,
      category: e.category,
      receipt: e.receipt ? { receipt_id: e.receipt.receipt_id } : null,
      has_receipt: Boolean(e.receipt),
    }));

    return { success: true, data: response };
  } catch (error) {
    console.error("Error in getAllExpenses:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update an expense (+ optional replace receipt)
 */
export const updateExpense = async (
  expenseId,
  userId,
  updateData,
  receiptFile = null
) => {
  try {
    const existing = await prisma.expense.findFirst({
      where: { expense_id: parseInt(expenseId), user_id: parseInt(userId) },
    });
    if (!existing) {
      return { success: false, error: "Expense not found or access denied" };
    }

    const { amount, date, categoryId, description, type, startDate, endDate } =
      updateData;

    const data = {
      ...(amount !== undefined && {
        amount: typeof amount === "string" ? parseFloat(amount) : amount,
      }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { category_id: parseInt(categoryId) }),
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

    const updated = await prisma.expense.update({
      where: { expense_id: parseInt(expenseId) },
      data,
      include: {
        category: true,
        receipt: {
          select: {
            receipt_id: true,
            filename: true,
            mime_type: true,
            size: true,
          },
        },
      },
    });

    let receiptMeta = null;
    if (receiptFile) {
      receiptMeta = await saveOrReplaceReceipt({
        expenseId: updated.expense_id,
        userId,
        file: receiptFile,
      });
    }

    const response = {
      expense_id: updated.expense_id,
      amount: updated.amount,
      description: updated.description,
      type: updated.type === "RECURRING" ? "recurring" : "one-time",
      date: updated.expense_date,
      startDate: updated.start_date,
      endDate: updated.end_date,
      last_processed: updated.last_processed,
      user_id: updated.user_id,
      categoryId: updated.category_id,
      category: updated.category,
      receipt: receiptMeta || updated.receipt || null,
      has_receipt: Boolean(receiptMeta || updated.receipt),
    };

    return { success: true, data: response };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        return { success: false, error: "Expense not found" };
      if (error.code === "P2003")
        return { success: false, error: "Invalid categoryId" };
      if (
        error.code === "P2002" &&
        String(error.meta?.target || "").includes("sha256")
      )
        return {
          success: false,
          error: "Duplicate receipt file (sha256 unique)",
        };
    }
    console.error("Error in updateExpense:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete an expense
 */
export const deleteExpense = async (expenseId, userId) => {
  try {
    const existing = await prisma.expense.findFirst({
      where: { expense_id: parseInt(expenseId), user_id: parseInt(userId) },
    });
    if (!existing) {
      return { success: false, error: "Expense not found or access denied" };
    }

    await prisma.expense.delete({ where: { expense_id: parseInt(expenseId) } });

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
