import e from "express";
import { Schema, model } from "mongoose";

const planSchema = Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    features: { type: [String], required: true },
    interval: { type: String, required: true, enum: ["monthly", "yearly"] },
  },
  { timestamps: true }
);

const Plan = model("Plan", planSchema);
export default Plan;
