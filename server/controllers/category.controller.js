import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getExpenseCategories,
  getExpenseCategoriesByUser,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from '../services/category.service.js';

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await getExpenseCategories(req.user.user_id);
  res.json(categories);
});

export const listUserCategories = asyncHandler(async (req, res) => {
  const categories = await getExpenseCategoriesByUser(req.user.user_id);
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon_url } = req.body;
  const created = await createExpenseCategory(req.user.user_id, { category_name: name, icon_url });
  res.status(201).json(created);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, icon_url } = req.body;
  const updated = await updateExpenseCategory(id, req.user.user_id, { category_name: name, icon_url });
  res.json(updated);
});

export const removeCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteExpenseCategory(id, req.user.user_id);
  res.status(204).send();
});
