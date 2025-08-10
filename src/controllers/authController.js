import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import responseHandler from "../utils/response.js";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "../utils/validationUserData.js";
import {
  INVALID_PASSWORD,
  USER_ALREADY_EXISTS,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_NOT_FOUND,
  USER_REGISTER_FAIL,
  USER_REGISTER_SUCCESS,
} from "../constants/responseMessages.js";
import { generateToken } from "../middlewares/generateToken.js";
import {
  generateOTP,
  sendVerificationEmail,
} from "../middlewares/generateOTP.js";
import OTP from "../models/OtpModel.js";
import Notification from "../models/NotificationModel.js";


export const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const validData = await registerValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  const userExists = await User.findOne({ email });

  if (userExists) {
    return responseHandler(res, 400, USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  if (!newUser) {
    return responseHandler(res, 400, USER_REGISTER_FAIL);
  }
  return responseHandler(res, 201, USER_REGISTER_SUCCESS);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const validData = await loginValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  const userExists = await User.findOne({ email });
  if (!userExists) {
    return responseHandler(res, 400, USER_NOT_FOUND);
  }
  const isPasswordValid = await bcrypt.compare(password, userExists.password);
  if (!isPasswordValid) {
    return responseHandler(res, 400, INVALID_PASSWORD);
  }
  generateToken(res, userExists?._id);
  await Notification.create({
    userId: userExists._id,
    message: "You have successfully logged in.",
    type: "info",
  });
  return responseHandler(res, 200, USER_LOGIN_SUCCESS);
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  return responseHandler(res, 200, USER_LOGOUT_SUCCESS);
});

export const checkAuth = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return responseHandler(res, 404, USER_NOT_FOUND);
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return responseHandler(res, 404, USER_NOT_FOUND);
  }

  await User.findByIdAndDelete(user._id);

  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return responseHandler(res, 200, "Account deleted successfully.");
});

export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // put the email in session for reset password
  req.session.tempUser = { email };
  if (!user) {
    return responseHandler(res, 404, USER_NOT_FOUND);
  }
  const otp = generateOTP();
  await OTP.create({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });
  await sendVerificationEmail(email, otp);
  return responseHandler(
    res,
    200,
    "OTP sent to your email. Please verify to reset your password."
  );
});

export const verifyForgetPasswordOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const { email } = req.session.tempUser;
  const storedOTP = await OTP.findOne({ email });
  if (!storedOTP || storedOTP.otp !== otp || storedOTP.expiresAt < Date.now()) {
    return responseHandler(res, 400, "Invalid or expired OTP.");
  }
  return responseHandler(
    res,
    200,
    "OTP verified successfully. You can now reset your password."
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { email } = req.session.tempUser;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });
  await OTP.deleteOne({ email });
  req.session.destroy();
  return responseHandler(res, 200, "Password reset successfully.");
});

export const updateProfileInfo = asyncHandler(async (req, res) => {
  const body = req.body;
  const user = req.user;
  if (body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    body.password = hashedPassword;
  }
  const updatedUser = await User.findByIdAndUpdate(user?._id, body, {
    new: true,
  });
  if (!updatedUser) {
    return responseHandler(res, 404, USER_NOT_FOUND);
  }
  return responseHandler(res, 200, "Profile updated successfully.");
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || process.env.DEFAULT_PAGE_COUNT;
  const limit = parseInt(req.query.limit) || process.env.DEFAULT_LIMIT_COUNT;
  const skip = (page - 1) * limit;
  const totalUsers = await User.countDocuments();

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return responseHandler(res, 200, "Users fetched successfully", {
    total: totalUsers,
    page,
    limit,
    users,
    totalPages: Math.ceil(totalUsers / limit),
  });
});
