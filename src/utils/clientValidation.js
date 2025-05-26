import * as Yup from "yup";

const clientValidationSchema = Yup.object({
  companyName: Yup.string().required("Company name is required"),
  companyAddress: Yup.string().required("Company address is required"),
  companyPhone: Yup.string().required("Company phone is required"),
  companyEmail: Yup.string()
    .email("Invalid email format")
    .required("Company email is required"),
  companyWebsite: Yup.string().url("Invalid website URL").optional(),
  companyDescription: Yup.string().required("Company description is required"),
  companySize: Yup.string().optional(),
  companyIndustry: Yup.string().required("Company industry is required"),
  commercialRegister: Yup.string().required("Commercial register is required"),
  taxId: Yup.string().required("Tax ID is required"),
});

export default clientValidationSchema;
