import { Schema, model } from "mongoose";

const subscribeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    active: { type: Boolean },
    status: { type: String, required: true },
    expireAt: { type: Date, required: false },
  },
  { timestamps: true }
);

const Subscribe = model("Subscribe", subscribeSchema);

export default Subscribe;
