import express from "express";
import {
  clearAllNotifications,
  getUnReadNotificationsCount,
  getUserNotifications,
  markNotificationAsRead,
  readAllNotifications,
} from "../controllers/notifications.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.patch("/:id/read", protectRoute, markNotificationAsRead);
router.patch("/read-all", protectRoute, readAllNotifications);
router.delete("/clear-all", protectRoute, clearAllNotifications);
router.get("/unread-count", protectRoute, getUnReadNotificationsCount);
export default router;
