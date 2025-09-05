import { prisma } from "../db/prisma.js";

/**
 * Get monthly expense summary, virtualizing recurring expenses.
 * A recurring expense is included in a month if:
 *   start_date <= monthEnd AND (end_date is null OR end_date >= monthStart)
 * One-time expenses are included if expense_date is within [monthStart, monthEnd].
 *
 * @param {number|string} userId
 * @param {Date} monthStart - first day of month at 00:00:00
 * @param {Date} monthEnd - last day of month at 23:59:59.999
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getMonthlyExpenseSummary = async (userId, monthStart, monthEnd) => {
  try {
    // Fetch all expenses that could contribute to this month
    const expenses = await prisma.expense.findMany({
      where: {
        user_id: parseInt(userId),
        OR: [
          {
            type: "ONE_TIME",
            expense_date: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
          {
            type: "RECURRING",
            start_date: {
              lte: monthEnd,
            },
            OR: [
              { end_date: null },
              { end_date: { gte: monthStart } },
            ],
          },
        ],
      },
      include: { category: true },
      // Order by expense_date, then deterministic tiebreaker by primary key
      orderBy: [{ expense_date: "asc" }, { expense_id: "asc" }],
    });

    // Build virtualized items
    const items = expenses.map((e) => {
      const isRecurring = e.type === "RECURRING";
      const itemDate = isRecurring ? monthStart : e.expense_date;
      return {
        id: e.expense_id,
        amount: e.amount,
        type: isRecurring ? "recurring" : "one-time",
        date: itemDate,
        categoryId: e.category_id,
        categoryName: e.category?.category_name || null,
        source: isRecurring ? "recurring-virtual" : "one-time",
      };
    });

    // Aggregate totals
    const total = items.reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const byCategoryMap = new Map();
    for (const i of items) {
      const key = i.categoryId;
      const current = byCategoryMap.get(key) || {
        categoryId: i.categoryId,
        categoryName: i.categoryName,
        total: 0,
      };
      current.total += Number(i.amount || 0);
      byCategoryMap.set(key, current);
    }

    const byCategory = Array.from(byCategoryMap.values()).sort((a, b) => b.total - a.total);

    return {
      success: true,
      data: {
        monthStart,
        monthEnd,
        total,
        byCategory,
        items,
      },
    };
  } catch (error) {
    console.error("Error in getMonthlyExpenseSummary:", error);
    return { success: false, error: error.message };
  }
};
