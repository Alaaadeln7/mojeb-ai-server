import express from "express";
import {
  acceptedEnrollmentFormStatus,
  createEnrollmentForm,
  deleteEnrollmentForm,
  getAllEnrollmentForms,
  getEnrollmentFormById,
  rejectedEnrollmentFormStatus,
  searchEnrollmentForms,
} from "../controllers/enrollmentForm.controller.js";

const router = express.Router();
router.get("/search", searchEnrollmentForms);
router.post("/create", createEnrollmentForm);
router.get("/", getAllEnrollmentForms);
router.get("/:id", getEnrollmentFormById);
router.put("/accepted-status/:id", acceptedEnrollmentFormStatus);
router.put("/rejected-status/:id", rejectedEnrollmentFormStatus);
router.delete("/delete/:id", deleteEnrollmentForm);
export default router;
