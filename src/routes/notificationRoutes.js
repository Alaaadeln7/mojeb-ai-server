import express from "express";
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead
} from "../controllers/notificationsController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();
router.post("/", protectRoute, createNotification);
router.get("/", protectRoute, getUserNotifications);
router.patch("/:id/read", protectRoute, markNotificationAsRead);
export default router;

/**


// الحصول على إشعارات مستخدم
router.get('/user/:userId', );

// تحديث حالة الإشعار إلى مقروء
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    res.send(notification);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
 * 
 * 
 */