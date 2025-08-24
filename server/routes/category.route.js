import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { listCategories, createCategory, updateCategory, removeCategory } from '../controllers/category.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', removeCategory);

export default router;
