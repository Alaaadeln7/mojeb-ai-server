import { Schema, model } from "mongoose";

const TicketSchema = new Schema(
  {
    to: { type: String, required: true },
    from: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = model("Ticket", TicketSchema);
export default Ticket;
