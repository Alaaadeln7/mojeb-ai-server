import * as Yup from "yup";

const clientValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Client name is required")
    .min(2, "Client name must be at least 2 characters")
    .max(100, "Client name cannot exceed 100 characters"),
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\+?[0-9]{10,15}$/,
      "Phone number must be 10-15 digits and may include + prefix"
    ),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),
  website: Yup.string()
    .optional()
    .url("Invalid website URL")
    .matches(
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      "Invalid website format"
    )
    .max(100, "Website URL cannot exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  size: Yup.string()
    .optional()
    .oneOf(["small", "medium", "large", "enterprise"], "Invalid company size"),
  industry: Yup.string()
    .required("Industry is required")
    .min(2, "Industry must be at least 2 characters")
    .max(50, "Industry cannot exceed 50 characters"),
  commercialRegister: Yup.string()
    .required("Commercial register is required")
    .min(5, "Commercial register must be at least 5 characters")
    .max(50, "Commercial register cannot exceed 50 characters"),
  taxId: Yup.string()
    .required("Tax ID is required")
    .min(5, "Tax ID must be at least 5 characters")
    .max(50, "Tax ID cannot exceed 50 characters")
    .matches(
      /^[A-Za-z0-9\-]+$/,
      "Tax ID can only contain letters, numbers, and hyphens"
    ),
});

export default clientValidationSchema;
