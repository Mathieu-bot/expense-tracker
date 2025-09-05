import express from "express";
import { getMonthlyExpensesReportController } from "../controllers/report.controller.js";

const router = express.Router();

// GET /api/reports/expenses/monthly?month=YYYY-MM
router.get("/expenses/monthly", getMonthlyExpensesReportController);

export default router;
