import * as Yup from 'yup';

const clientValidationSchema = Yup.object({
  companyName: Yup.string().required("Company name is required"),
  companyAddress: Yup.string().required("Company address is required"),
  companyPhone: Yup.string().required("Company phone is required"),
  companyEmail: Yup.string()
    .email("Invalid email format")
    .required("Company email is required"),
  companyWebsite: Yup.string()
    .url("Invalid website URL")
    .required("Company website is required"),
  companyDescription: Yup.string().required("Company description is required"),
  companyType: Yup.string().required("Company type is required"),
  companySize: Yup.string().required("Company size is required"),
  companyIndustry: Yup.string().required("Company industry is required"),
  commercialRegister: Yup.string().required("Commercial register is required"),
  taxId: Yup.string().required("Tax ID is required"),
  vatNumber: Yup.string().required("VAT number is required"),
});

export default clientValidationSchema;
