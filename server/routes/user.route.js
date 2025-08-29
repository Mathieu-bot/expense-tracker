import { Router } from "express";
import {
  getUserProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";
import {
  validateUpdateProfile,
  validateChangePassword,
} from "../middleware/validate.js";

const router = Router();

router.get("/profile", getUserProfile);
router.put("/profile", validateUpdateProfile, updateProfile);
router.patch("/profile/password", validateChangePassword, changePassword);

export default router;
