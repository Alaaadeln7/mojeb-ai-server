import express from "express";
import cors from "cors";
import { config } from "dotenv";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerSpec from "./docs/swaggerDocs.js";
import connectDB from "./config/connectedDB.js";
import { CORSOPTIONS, RATE_LIMIT_OPTIONS } from "./constants/index.js";
import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import clientsRoutes from "./routes/clientsRoutes.js";
import callsRoutes from "./routes/callsRoutes.js";
import botRoutes from "./routes/botRoutes.js";
import chatBotRoutes from "./routes/chatbotRoutes.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import { app, server } from "./config/socket.js";
import Redis from "ioredis";
import { RedisStore } from "connect-redis";

config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Redis Configuration
const redisClient = new Redis(process.env.UPSTASH_REDIS_URL);

// 🛡️ Event Listeners for Redis
redisClient.on("connect", () => console.log("🚀 Connected to Redis"));
redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

// ✅ Session Configuration
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SECRET_KEY_SESSION || "my_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// ✅ Middleware
const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(cors(CORSOPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(rateLimit(RATE_LIMIT_OPTIONS));
app.use(express.json({ limit: "10mb" }));

// ✅ API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/calls", callsRoutes);
app.use("/api/bot", botRoutes);
app.use("/api/chatbot", chatBotRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Docs are available at http://localhost:${PORT}/api-docs`);
});
