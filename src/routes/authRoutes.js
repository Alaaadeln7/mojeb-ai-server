import express from "express";
import {
  login,
  logout,
  checkAuth,
  deleteAccount,
  updateProfileInfo,
  forgetPassword,
  resetPassword,
  verifyForgetPasswordOTP,
  getAllUsers,
  createUser,
} from "../controllers/authController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { checkAdminRole } from "../middlewares/checkUserRole.js";
const router = express.Router();

// router.post("/verify-otp", verifyOTP);
router.post("/create-user", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", protectRoute, checkAuth);
router.put("/update-info", protectRoute, updateProfileInfo);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp-forget-password", verifyForgetPasswordOTP);
router.post("/reset-password", resetPassword);
router.delete("/delete-account", protectRoute, deleteAccount);
router.get("/users", protectRoute, checkAdminRole, getAllUsers);
export default router;
