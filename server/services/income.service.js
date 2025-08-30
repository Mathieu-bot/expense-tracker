import { prisma } from "../db/prisma.js";

//---------------INCOME---------------//

//POST
const createIncome = async (user_id, data) => {
  return await prisma.income.create({
    data: {
      ...data,
      user: { connect: { user_id } },
    },
  });
};

//GET ALL (with start and end date query params)
const getIncomes = async (user_id, filters = {}) => {
  const where = { user_id };

  if (filters.start || filters.end) {
    where.date = {};
    if (filters.start) where.date.gte = new Date(filters.start);
    if (filters.end) where.date.lte = new Date(filters.end);
  }

  return await prisma.income.findMany({
    where,
    orderBy: [{ date: "desc" }, { creation_date: "desc" }],
  });
};

//GET BY ID
const getIncomeById = async (id, user_id) => {
  return await prisma.income.findFirst({
    where: { income_id: parseInt(id), user_id },
  });
};

//UPDATE
const updateIncome = async (id, user_id, data) => {
  const income = await prisma.income.findFirst({
    where: { income_id: parseInt(id), user_id },
  });

  if (!income) {
    throw new Error("Income not found or not authorized");
  }

  return await prisma.income.update({
    where: { income_id: parseInt(id) },
    data,
  });
};

//DELETE
const deleteIncome = async (id, user_id) => {
  const income = await prisma.income.findFirst({
    where: { income_id: parseInt(id), user_id },
  });

  if (!income) {
    throw new Error("Income not found or not authorized");
  }

  await prisma.income.delete({
    where: { income_id: parseInt(id) },
  });
};

export default {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
};
