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

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const validData = await registerValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  const userExists = await User.findOne({ email });
  if (userExists) {
    return responseHandler(res, 400, USER_ALREADY_EXISTS);
  }

  const otp = generateOTP();
  await OTP.create({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });
  req.session.tempUser = { fullName, email, password };
  await sendVerificationEmail(email, otp);
  return responseHandler(
    res,
    200,
    "OTP sent to your email. Please verify to complete registration."
  );
});

export const verifyOTP = asyncHandler(async (req, res) => {
  if (!req.session.tempUser) {
    return responseHandler(res, 400, "Session expired or not found.");
  }

  const { otp } = req.body;
  const { email, fullName, password } = req.session.tempUser;

  const storedOTP = await OTP.findOne({ email });
  if (
    !storedOTP ||
    storedOTP.otp !== otp ||
    !storedOTP.expiresAt ||
    storedOTP.expiresAt < Date.now()
  ) {
    return responseHandler(res, 400, "Invalid or expired OTP.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return responseHandler(res, 400, USER_REGISTER_FAIL);
    }

    generateToken(res, newUser?._id);
    await OTP.deleteOne({ email });

    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
      }
    });

    return responseHandler(res, 201, USER_REGISTER_SUCCESS);
  } catch (error) {
    console.error("Database error:", error);
    return responseHandler(res, 500, "Internal Server Error.");
  }
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
  return responseHandler(res, 200, USER_LOGIN_SUCCESS);
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
