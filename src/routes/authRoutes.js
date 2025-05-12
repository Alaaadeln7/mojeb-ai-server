import express from 'express';
import {
  register,
  verifyOTP,
  login,
  logout,
  checkAuth,
  deleteAccount,
  updateProfileInfo,
  forgetPassword,
  resetPassword,
  verifyForgetPasswordOTP,
} from '../controllers/authController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', protectRoute, checkAuth);
router.put("/update-info", protectRoute, updateProfileInfo)
router.post("/forget-password", forgetPassword)
router.post("/verify-otp-forget-password", verifyForgetPasswordOTP)
router.post("/reset-password", resetPassword)
router.delete("/delete-account", protectRoute, deleteAccount)
export default router;
