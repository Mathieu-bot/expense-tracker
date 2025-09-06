import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getAlert,
  getSummaryBetweenCustomPeriod,
  getSummaryForAMonth,
} from "../controllers/summary.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", getSummaryBetweenCustomPeriod);
router.get("/monthly", getSummaryForAMonth);
router.get("/alerts", getAlert);

export default router;
