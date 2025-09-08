// src/services/expense.service.js
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { supabase } from "../lib/supabase.js"; // <-- assure-toi d'avoir ce client service role

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]);
const BUCKET = process.env.SUPABASE_BUCKET_RECEIPTS || "Receipt";

// Helpers --------------------------------------------------------------
function assertFileOk(file) {
  if (!file) return;
  if (!ALLOWED.has(file.mimetype))
    throw new Error(`Unhandled file type: ${file.mimetype}`);
  if (file.size > MAX_BYTES)
    throw new Error(
      `File too large (> 5 Mo): ${(file.size / 1024 / 1024).toFixed(2)} Mo`
    );
  if (!file.buffer)
    throw new Error("No buffer found.");
}

function extFromMime(mime) {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "application/pdf") return "pdf";
  return "bin";
}

async function uploadPublicFile({ userId, expenseId, file }) {
  const ext = extFromMime(file.mimetype);
  const key = crypto.randomUUID();
  const path = `${userId}/${expenseId}/${key}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

  if (upErr) throw new Error(`Supabase upload failed: ${upErr.message}`);

  // URL publique (bucket public)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

function storagePathFromPublicUrl(url) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

async function deletePublicFileByUrl(url) {
  const path = storagePathFromPublicUrl(url);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

// ---------------------------------------------------------------------
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
      include: { category: true },
    });

    if (receiptFile) {
      assertFileOk(receiptFile);
      const { url } = await uploadPublicFile({
        userId: created.user_id,
        expenseId: created.expense_id,
        file: receiptFile,
      });

      await prisma.expense.update({
        where: { expense_id: created.expense_id },
        data: {
          receipt_url: url,
          receipt_mime: receiptFile.mimetype,
          receipt_size: receiptFile.size,
        },
      });

      created.receipt_url = url;
      created.receipt_mime = receiptFile.mimetype;
      created.receipt_size = receiptFile.size;
    }

    // Réponse API
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
      receipt_url: created.receipt_url ?? null,
      receipt_mime: created.receipt_mime ?? null,
      receipt_size: created.receipt_size ?? null,
      has_receipt: Boolean(created.receipt_url),
    };

    return { success: true, data: response };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003")
        return { success: false, error: "Invalid categoryId" };
    }
    console.error("Error in createExpense:", error);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------------------------
export const getExpenseById = async (expenseId, userId) => {
  try {
    const expense = await prisma.expense.findFirst({
      where: { expense_id: parseInt(expenseId), user_id: parseInt(userId) },
      include: { category: true },
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
      receipt_url: expense.receipt_url ?? null,
      receipt_mime: expense.receipt_mime ?? null,
      receipt_size: expense.receipt_size ?? null,
      has_receipt: Boolean(expense.receipt_url),
    };

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------------------------
// READ MANY
export const getAllExpenses = async (userId, filters = {}) => {
  try {
    const { start, end, category, type } = filters;

    const where = { user_id: parseInt(userId), AND: [] };

    if (category) {
      // filtre relationnel correct
      where.AND.push({ category: { is: { category_name: category } } });
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
      include: { category: true },
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
      receipt_url: e.receipt_url ?? null,
      receipt_mime: e.receipt_mime ?? null,
      receipt_size: e.receipt_size ?? null,
      has_receipt: Boolean(e.receipt_url),
    }));

    return { success: true, data: response };
  } catch (error) {
    console.error("Error in getAllExpenses:", error);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------------------------
// UPDATE
export const updateExpense = async (
  expenseId,
  userId,
  updateData,
  receiptFile = null
) => {
  try {
    const existing = await prisma.expense.findFirst({
      where: { expense_id: parseInt(expenseId), user_id: parseInt(userId) },
      select: { receipt_url: true },
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
      include: { category: true },
    });

    if (receiptFile) {
      assertFileOk(receiptFile);
      if (existing.receipt_url) {
        await deletePublicFileByUrl(existing.receipt_url);
      }
      const { url } = await uploadPublicFile({
        userId: updated.user_id,
        expenseId: updated.expense_id,
        file: receiptFile,
      });

      const withReceipt = await prisma.expense.update({
        where: { expense_id: updated.expense_id },
        data: {
          receipt_url: url,
          receipt_mime: receiptFile.mimetype,
          receipt_size: receiptFile.size,
        },
        include: { category: true },
      });

      return {
        success: true,
        data: {
          expense_id: withReceipt.expense_id,
          amount: withReceipt.amount,
          description: withReceipt.description,
          type: withReceipt.type === "RECURRING" ? "recurring" : "one-time",
          date: withReceipt.expense_date,
          startDate: withReceipt.start_date,
          endDate: withReceipt.end_date,
          last_processed: withReceipt.last_processed,
          user_id: withReceipt.user_id,
          categoryId: withReceipt.category_id,
          category: withReceipt.category,
          receipt_url: withReceipt.receipt_url ?? null,
          receipt_mime: withReceipt.receipt_mime ?? null,
          receipt_size: withReceipt.receipt_size ?? null,
          has_receipt: Boolean(withReceipt.receipt_url),
        },
      };
    }
    return {
      success: true,
      data: {
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
        receipt_url: existing.receipt_url ?? null,
        has_receipt: Boolean(existing.receipt_url),
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        return { success: false, error: "Expense not found" };
      if (error.code === "P2003")
        return { success: false, error: "Invalid categoryId" };
    }
    console.error("Error in updateExpense:", error);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------------------------
// DELETE
export const deleteExpense = async (expenseId, userId) => {
  try {
    const existing = await prisma.expense.findFirst({
      where: { expense_id: parseInt(expenseId), user_id: parseInt(userId) },
      select: { receipt_url: true },
    });
    if (!existing) {
      return { success: false, error: "Expense not found or access denied" };
    }

    if (existing.receipt_url) {
      await deletePublicFileByUrl(existing.receipt_url);
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
