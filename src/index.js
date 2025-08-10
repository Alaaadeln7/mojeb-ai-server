import express from "express";
import cors from "cors";
import { config } from "dotenv";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import swaggerSpec from "./docs/swaggerDocs.js";
import connectDB from "./config/connectedDB.js";
import { CORSOPTIONS, RATE_LIMIT_OPTIONS } from "./constants/index.js";
import authRoutes from "./routes/authRoutes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import clientsRoutes from "./routes/clientsRoutes.js";
import chatBotRoutes from "./routes/chatbotRoutes.js";
import planRoutes from "./routes/plansRoutes.js";
import twilioRoutes from "./routes/twilioRoutes.js";
import enrollmentFormRoutes from "./routes/enrollmentForm.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import { app, server } from "./config/socket.js";
import MongoStore from "connect-mongo";
// import { integrationSlack } from "./config/slack.js";
config();
// integrationSlack();
connectDB();

app.use(
  session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      collectionName: "sessions",
      ttl: 60 * 60 * 24,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
const PORT = process.env.PORT || 3000;
// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
  })
);

// CORS configuration
app.use(cors(CORSOPTIONS));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

// Cookie parser
app.use(cookieParser());

// Rate limiting
// const limiter = rateLimit(RATE_LIMIT_OPTIONS);
// app.use(limiter);

// app.use(rateLimit(RATE_LIMIT_OPTIONS));
app.use(express.json({ limit: "10mb" }));
const api_prefix = "/api";

app.use(`${api_prefix}-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${api_prefix}/auth`, authRoutes);
app.use(`${api_prefix}/notifications`, notificationRoutes);
app.use(`${api_prefix}/clients`, clientsRoutes);
app.use(`${api_prefix}/chatbot`, chatBotRoutes);
app.use(`${api_prefix}/plans`, planRoutes);
app.use(`${api_prefix}/enrollment-form`, enrollmentFormRoutes);
app.use(`${api_prefix}/twilio`, twilioRoutes);
app.use(`${api_prefix}/tickets`, ticketRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Docs are available at http://localhost:${PORT}/api-docs`);
});
