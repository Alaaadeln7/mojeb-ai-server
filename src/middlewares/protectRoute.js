import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { FAILED } from "../constants/statusText.js";
import { verifyToken } from "./generateToken.js";
import responseHandler from "../utils/response.js";
import { UNAUTHORIZED, USER_NOT_FOUND } from "../constants/responseMessages.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return responseHandler(res, 401, UNAUTHORIZED);
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return responseHandler(res, 401, UNAUTHORIZED);
    }
    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user) {
      return responseHandler(res, 404, USER_NOT_FOUND);
    }
    req.user = user;

    next();
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: FAILED, message: "Internal Server Error" });
  }
};
