import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, required: true },
    link: { type: String },
  },
  { timestamps: true }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
