import * as Yup from "yup";

const adminValidationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name is too long"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .nullable(),
  address: Yup.string().max(200, "Address is too long").nullable(),
  role: Yup.string().oneOf(["admin"], "Role must be admin").default("admin"),
});

export default adminValidationSchema;
