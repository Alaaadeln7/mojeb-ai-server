import { Schema, model } from "mongoose";

const enrollmentFormSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    website: { type: String, required: true },
    address: { type: String, required: true },
    industry: { type: String, required: true },
    commercialRegister: { type: String, required: true },
    taxId: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
  },
  { timestamps: true }
);

const EnrollmentForm = model("EnrollmentForm", enrollmentFormSchema);

export default EnrollmentForm;
