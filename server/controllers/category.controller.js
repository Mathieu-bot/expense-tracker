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
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  try {
    const created = await createExpenseCategory(req.user.user_id, { category_name: name, icon_url });
    res.status(201).json(created);
  } catch (err) {
    if (err.message.includes('exists')) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    throw err;
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, icon_url } = req.body;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Invalid category ID' });
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  try {
    const updated = await updateExpenseCategory(id, req.user.user_id, { category_name: name, icon_url });
    res.json(updated);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: 'Category not found or not authorized' });
    }
    if (err.message.includes('exists')) {
      return res.status(409).json({ error: 'Category name already exists' });
    }
    throw err;
  }
});

export const removeCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Invalid category ID' });

  try {
    await deleteExpenseCategory(id, req.user.user_id);
    res.status(204).send();
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: 'Category not found or not authorized' });
    }
    if (err.message.includes('being used')) {
      return res.status(409).json({ error: 'Cannot delete category that is being used' });
    }
    throw err;
  }
});
