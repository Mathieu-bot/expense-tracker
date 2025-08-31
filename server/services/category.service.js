import { prisma } from '../db/prisma.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

// return global (user_id null) + user categories
export const getExpenseCategories = async (userId) => {
  return prisma.expenseCategory.findMany({
    where: { OR: [{ user_id: null }, { user_id: userId }] },
    orderBy: [{ is_custom: 'asc' }, { category_name: 'asc' }],
  });
};

export const getExpenseCategoriesByUser = async (userId) => {
  return prisma.expenseCategory.findMany({
    where: { user_id: userId },
    orderBy: [{ is_custom: 'asc' }, { category_name: 'asc' }],
  });
};

export const createExpenseCategory = async (userId, data) => {
  const exists = await prisma.expenseCategory.findFirst({
    where: {
      category_name: { equals: data.category_name, mode: 'insensitive' },
      user_id: userId,
    },
  });
    if (exists) throw new ConflictError('Category already exists');

  return prisma.expenseCategory.create({
    data: {
      category_name: data.category_name,
      icon_url: data.icon_url,
      is_custom: true,
      user: { connect: { user_id: userId } },
    },
  });
};

export const updateExpenseCategory = async (id, userId, data) => {
  const categoryId = parseInt(id);
  const category = await prisma.expenseCategory.findFirst({
    where: { category_id: categoryId, user_id: userId },
  });
  if (!category) throw new NotFoundError('Category not found or not authorized');

  if (data.category_name) {
    const dup = await prisma.expenseCategory.findFirst({
      where: {
        category_name: { equals: data.category_name, mode: 'insensitive' },
        user_id: userId,
        NOT: { category_id: categoryId },
      },
    });
        if (dup) throw new ConflictError('Category name already exists');
  }

  return prisma.expenseCategory.update({
    where: { category_id: categoryId },
    data: { category_name: data.category_name, icon_url: data.icon_url },
  });
};

export const deleteExpenseCategory = async (id, userId) => {
  const categoryId = parseInt(id);
  const category = await prisma.expenseCategory.findFirst({
    where: { category_id: categoryId, user_id: userId },
  });
  if (!category) throw new NotFoundError('Category not found or not authorized');

  const used = await prisma.expense.count({ where: { category_id: categoryId } });
    if (used > 0) throw new ConflictError('Cannot delete category that is being used');

  await prisma.expenseCategory.delete({ where: { category_id: categoryId } });
};
