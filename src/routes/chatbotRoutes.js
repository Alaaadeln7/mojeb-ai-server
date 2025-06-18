import express from "express";
import {
  addInquiry,
  deleteInquiry,
  getChatbot,
  testAudio,
  updateInquiry,
} from "../controllers/chatbotController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.get("/:chatbotId", protectRoute, getChatbot);
router.post("/create", protectRoute, addInquiry);
router.delete("/delete", protectRoute, deleteInquiry);
router.put("/update", protectRoute, updateInquiry);
router.post("/speak", testAudio);
export default router;
