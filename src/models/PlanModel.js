import { Schema, model } from "mongoose";

const planSchema = Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type: [String], required: true },
});

const Plan = model("Plan", planSchema);
export default Plan;
