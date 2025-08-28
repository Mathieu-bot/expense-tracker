import { Router } from "express";
import {
  createIncome,
  getIncomes,
  getIncome,
  updateIncome,
  deleteIncome,
} from "../controllers/income.controller.js";
import {
  validateIncomeCreate,
  validateIncomeUpdate,
  validateIncomeQuery,
} from "../middleware/incomeValidation.js";
import { validateIdParam } from "../middleware/validate.js";

const router = Router();

// INCOME ROUTES
router.get("/", validateIncomeQuery, getIncomes);
router.get("/:id", validateIdParam("id"), getIncome);
router.post("/", validateIncomeCreate, createIncome);
router.put("/:id", validateIdParam("id"), validateIncomeUpdate, updateIncome);
router.delete("/:id", validateIdParam("id"), deleteIncome);

export default router;
