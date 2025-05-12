import express from "express";
const router = express.Router();
import { askBot, addQuestion } from "../controllers/chatbotController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { checkAdminRole } from "../middlewares/checkAdminRole.js";

/**
 * @desc    Respond to a user question
 * @route   POST /api/chatbot/ask
 * @access  Public
 * @params  {question}
 */
router.post("/ask", protectRoute, askBot);
router.post("/add", protectRoute, checkAdminRole, addQuestion);

export default router;

