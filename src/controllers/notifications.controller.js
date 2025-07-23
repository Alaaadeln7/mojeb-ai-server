import asyncHandler from "../middlewares/asyncHandler.js";
import Notification from "../models/NotificationModel.js";
import responseHandler from "../utils/response.js";

export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const notifications = await Notification.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ userId });

  return responseHandler(
    res,
    200,
    "Notifications fetched successfully",
    notifications,
    {
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + notifications.length < total,
    }
  );
});
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    return responseHandler(res, 404, "Notification not found");
  }
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  return responseHandler(
    res,
    200,
    "Notification marked as read successfully",
    notification
  );
});
export const clearAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Notification.deleteMany({ userId });
  return responseHandler(res, 200, "All notifications cleared successfully");
});

export const readAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Notification.updateMany({ userId }, { isRead: true });
  return responseHandler(
    res,
    200,
    "All notifications marked as read successfully"
  );
});

export const deleteNotification = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    return responseHandler(res, 404, "Notification not found");
  }
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) {
    return responseHandler(res, 404, "Notification not found");
  }
  return responseHandler(
    res,
    200,
    "Notification deleted successfully",
    notification
  );
});

export const getUnReadNotificationsCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const count = await Notification.countDocuments({
    userId,
    isRead: false,
  });
  return responseHandler(
    res,
    200,
    "Unread notifications count fetched successfully",
    { count }
  );
});
