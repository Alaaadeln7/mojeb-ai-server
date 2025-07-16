import * as yup from "yup";

export const enrollmentFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  company: yup.string().required("Company name is required"),
  website: yup.string().url("Invalid URL").required("Website is required"),
  address: yup.string().required("Address is required"),
  industry: yup.string().required("Industry is required"),
  commercialRegister: yup.string().required("Commercial register is required"),
  taxId: yup.string().required("Tax ID is required"),
  message: yup.string().required("Message is required"),
  status: yup
    .string()
    .oneOf(["pending", "accepted", "rejected"], "Invalid status")
    .default("pending"),
});

export const validateEnrollmentForm = async (data) => {
  try {
    await enrollmentFormSchema.validate(data, { abortEarly: false });
    return { valid: true, errors: null };
  } catch (err) {
    return { valid: false, errors: err.errors };
  }
};

export const validateUpdateStatus = async (data) => {
  const schema = yup.object().shape({
    status: yup
      .string()
      .oneOf(
        ["accepted", "rejected"],
        "Status must be either accepted or rejected"
      )
      .required(),
  });

  try {
    await schema.validate(data, { abortEarly: false });
    return { valid: true, errors: null };
  } catch (err) {
    return { valid: false, errors: err.errors };
  }
};
