import * as yup from "yup";
import Plan from "../models/PlanModel.js";

// Define Yup validation schema
export const planValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title cannot exceed 50 characters")
    .test("is-unique", "Plan with this title already exists", async (value) => {
      const exists = await Plan.findOne({ title: value });
      return !exists;
    }),
  size: yup.number(),
  description: yup
    .string()
    .max(500, "Description cannot exceed 500 characters"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive")
    .typeError("Price must be a number"),
  interval: yup
    .string()
    .required("Interval is required")
    .oneOf(["monthly", "yearly"], "Interval must be either monthly or yearly"),
  features: yup
    .array()
    .of(yup.string().min(3, "Feature must be at least 3 characters"))
    .min(1, "At least one feature is required")
    .max(20, "Cannot have more than 20 features"),
});
