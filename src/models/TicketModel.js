import { Schema, model } from "mongoose";
import { BOT_STATUS } from "../constants/index.js";
const { PENDING, COMPLETED, PROGRESS } = BOT_STATUS;
const ticketSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: [PENDING, PROGRESS, COMPLETED],
      default: PENDING,
    },
    scheduledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Ticket = model("Ticket", ticketSchema);
export default Task;
