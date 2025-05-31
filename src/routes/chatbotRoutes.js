import express from "express";
import {
  addInquiry,
  deleteInquiry,
  getChatbot,
} from "../controllers/chatbotController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.get("/:clientId", protectRoute, getChatbot);
router.post("/:chatbotId/create", protectRoute, addInquiry);
router.delete("/delete/:inquiryId", protectRoute, deleteInquiry);
export default router;
