import { config } from "dotenv";
config();
export const CORSOPTIONS = {
  origin: [process.env.CLIENT_URL, "http://localhost:3000"],
  credentials: true,
};
console.log(process.env.CLIENT_URL);
export const JWT_EXPIRES_IN = "30d";
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
export const JWT_COOKIE_EXPIRES_IN = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
export const JWT_COOKIE_NAME = "token";
export const JWT_COOKIE_OPTIONS = {
  expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

export const RATE_LIMIT_OPTIONS = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

export const BOT_STATUS = {
  PENDING: "pending",
  PROGRESS: "in-progress",
  COMPLETED: "completed",
};
