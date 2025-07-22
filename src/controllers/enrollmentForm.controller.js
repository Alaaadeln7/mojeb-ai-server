import asyncHandler from "../middlewares/asyncHandler.js";
import EnrollmentForm from "../models/EnrollmentFormModel.js";
import {
  validateEnrollmentForm,
  validateUpdateStatus,
} from "../utils/enrollmentFormValidation.js";
import responseHandler from "../utils/response.js";

export const createEnrollmentForm = asyncHandler(async (req, res) => {
  try {
    const { valid, errors } = await validateEnrollmentForm(req.body);
    if (!valid) {
      return res.status(400).json({ errors });
    }

    const enrollmentForm = new EnrollmentForm(req.body);
    await enrollmentForm.save();

    res.status(201).json({
      message: "Enrollment form submitted successfully",
      data: enrollmentForm,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting enrollment form",
      error: error.message,
    });
  }
});

export const acceptedEnrollmentFormStatus = asyncHandler(async (req, res) => {
  try {
    const enrollmentForm = await EnrollmentForm.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    if (!enrollmentForm) {
      return res.status(404).json({
        message: "Enrollment form not found",
      });
    }

    res.status(200).json({
      message: "Enrollment form status updated successfully",
      data: enrollmentForm,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating enrollment form status",
      error: error.message,
    });
  }
});

export const rejectedEnrollmentFormStatus = asyncHandler(async (req, res) => {
  try {
    const enrollmentForm = await EnrollmentForm.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!enrollmentForm) {
      return res.status(404).json({
        message: "Enrollment form not found",
      });
    }

    res.status(200).json({
      message: "Enrollment form status updated successfully",
      data: enrollmentForm,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating enrollment form status",
      error: error.message,
    });
  }
});

export const getAllEnrollmentForms = asyncHandler(async (req, res) => {
  // const page = parseInt(req.query.page) || process.env.DEFAULT_PAGE_COUNT;
  // const limit = parseInt(req.query.limit) || process.env.DEFAULT_LIMIT_COUNT;
  // const skip = (page - 1) * limit;
  // const totalEnrollmentForms = await EnrollmentForm.countDocuments();
  try {
    const enrollmentForms = await EnrollmentForm.find().select("-__v");

    return responseHandler(
      res,
      200,
      "Enrollment forms fetched successfully",
      enrollmentForms
    );
  } catch (error) {
    return responseHandler(res, 500, "Error fetching enrollment forms");
  }
});

export const getEnrollmentFormById = asyncHandler(async (req, res) => {
  try {
    const enrollmentForm = await EnrollmentForm.findById(req.params.id);
    if (!enrollmentForm) {
      return res.status(404).json({
        message: "Enrollment form not found",
      });
    }
    res.status(200).json({
      message: "Enrollment form fetched successfully",
      data: enrollmentForm,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching enrollment form",
      error: error.message,
    });
  }
});

export const deleteEnrollmentForm = asyncHandler(async (req, res) => {
  try {
    const enrollmentForm = await EnrollmentForm.findByIdAndDelete(
      req.params.id
    );
    if (!enrollmentForm) {
      return responseHandler(res, 404, "Enrollment form not found");
    }
    return responseHandler(res, 200, "Enrollment form deleted successfully");
  } catch (error) {
    return responseHandler(res, 500, "Error deleting enrollment form");
  }
});
