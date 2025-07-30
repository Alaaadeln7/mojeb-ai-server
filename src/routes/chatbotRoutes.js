import express from "express";
import {
  addDescription,
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
router.post("/add-description", protectRoute, addDescription);
export default router;
