import asyncHandler from "../middlewares/asyncHandler.js";
import Plan from "../models/PlanModel.js";
import { planValidationSchema } from "../utils/planValidation.js";
import responseHandler from "../utils/response.js";
import * as yup from "yup";
export const createPlan = asyncHandler(async (req, res) => {
  try {
    const validatedData = await planValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    // Create and save new plan
    const newPlan = await Plan.create(validatedData);
    return responseHandler(res, 201, "Plan created successfully");
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});

      return responseHandler(res, 400, "Validation failed", { errors });
    }
    throw error;
  }
});

export const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find();
  return responseHandler(res, 200, "Plans fetched successfully", plans);
});

export const deletePlans = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const deletingPlan = await Plan.findByIdAndDelete(planId);
  if (!deletingPlan) {
    return responseHandler(res, 404, "Plan not found");
  }
  return responseHandler(res, 200, "Plan deleted successfully");
});

export const updatePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const { title, price, features, description } = req.body;
  const updatingPlan = await Plan.findByIdAndUpdate(
    planId,
    { title, price, features, description },
    { new: true }
  );
  if (!updatingPlan) {
    return responseHandler(res, 404, "Plan not found");
  }
  return responseHandler(res, 200, "Plan updated successfully");
});

export const getSinglePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const plan = await Plan.findById(planId);
  if (!plan) {
    return responseHandler(res, 404, "Plan not found");
  }
  return responseHandler(res, 200, "Plan fetched successfully", plan);
});
