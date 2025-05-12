import jwt from 'jsonwebtoken';
import { JWT_COOKIE_NAME, JWT_COOKIE_OPTIONS, JWT_EXPIRES_IN } from '../constants/index.js';
import { config } from "dotenv"
config();
export const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  setCookie(res, token);
  return token;
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const setCookie = (res, token) => {
  res.cookie(JWT_COOKIE_NAME, token, JWT_COOKIE_OPTIONS);
};
