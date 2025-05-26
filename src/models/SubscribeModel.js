import { Schema, model } from "mongoose";

const subscribeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
});

const Subscribe = model("Subscribe", subscribeSchema);

export default Subscribe;
