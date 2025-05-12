import { io } from "../config/socket.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Notification from "../models/NotificationModel.js";
import responseHandler from "../utils/response.js";

export const createNotification = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const user = req.user._id;
  const notification = new Notification({ user, message });
  await notification.save();
  io.to(notification.user.toString()).emit('notification', notification);
  return responseHandler(res, 201, "Notification created successfully");
})
export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notifications = await Notification.find({
    user: userId,
  }).sort({ createdAt: -1 });
  return responseHandler(res, 200, "Notifications fetched successfully", notifications);
})
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  return responseHandler(res, 200, "Notification marked as read successfully", notification);
})