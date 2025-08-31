import { prisma } from "../db/prisma.js";

function toDateRange(start, end) {
  return {
    gte: new Date(`${start}T00:00:00.000Z`),
    lt: new Date(`${end}T23:59:59.999Z`),
  };
}

const getSummaryBetweenCustomPeriod = async (user_id, start, end) => {
  const incomeSummary = await prisma.income.aggregate({
    _sum: { amount: true },
    where: {
      user_id,
      date: toDateRange(start, end),
    },
  });

  const expenseSummary = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      user_id,
      OR: [
        {
          type: "ONE_TIME",
          expense_date: toDateRange(start, end),
        },
        {
          type: "RECURRING",
          start_date: toDateRange(start, end),
          end_date: toDateRange(start, end),
        },
      ],
    },
  });

  return {
    totalIncome: incomeSummary._sum.amount || 0,
    totalExpense: expenseSummary._sum.amount || 0,
    netBalance:
      (incomeSummary._sum.amount || 0) - (expenseSummary._sum.amount || 0),
  };
};

const getSummaryForAMonth = async (user_id, month, year) => {
  const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
  const nextMonth = (parseInt(month, 10) + 1).toString().padStart(2, "0");
  const end = new Date(`${year}-${nextMonth}-01T00:00:00.000Z`);

  const incomeSummary = await prisma.income.aggregate({
    _sum: { amount: true },
    where: {
      user_id,
      date: { gte: start, lt: end },
    },
  });

  const expenseSummary = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      user_id,
      OR: [
        {
          type: "ONE_TIME",
          expense_date: { gte: start, lt: end },
        },
        {
          type: "RECURRING",
          start_date: { gte: start, lt: end },
          end_date: { gte: start, lt: end },
        },
      ],
    },
  });

  return {
    totalIncome: incomeSummary._sum.amount || 0,
    totalExpense: expenseSummary._sum.amount || 0,
    netBalance:
      (incomeSummary._sum.amount || 0) - (expenseSummary._sum.amount || 0),
  };
};

const getAlert = async (user_id) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
  const nextMonth = (parseInt(month, 10) + 1).toString().padStart(2, "0");
  const end = new Date(`${year}-${nextMonth}-01T00:00:00.000Z`);

  const monthlyExpense = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      user_id,
      OR: [
        {
          type: "ONE_TIME",
          expense_date: { gte: start, lt: end },
        },
        {
          type: "RECURRING",
          start_date: { gte: start, lt: end },
          end_date: { gte: start, lt: end },
        },
      ],
    },
  });

  const monthlyIncome = await prisma.income.aggregate({
    _sum: { amount: true },
    where: {
      user_id,
      date: { gte: start, lt: end },
    },
  });

  const totalIncome = monthlyIncome._sum.amount || 0;
  const totalExpense = monthlyExpense._sum.amount || 0;

  return totalExpense > totalIncome
    ? {
        alert: true,
        message: `You've exceeded your monthly budget by ${
          totalExpense - totalIncome
        }`,
      }
    : {
        alert: false,
        message: `You're within your budget by ${totalIncome - totalExpense}`,
      };
};

export default {
  getSummaryBetweenCustomPeriod,
  getAlert,
  getSummaryForAMonth,
};
