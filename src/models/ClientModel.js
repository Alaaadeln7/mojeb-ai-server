import { Schema, model } from "mongoose";

const clientSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  companyAddress: { type: String, required: true },
  companyPhone: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyWebsite: { type: String, required: true },
  companyDescription: { type: String, required: true },
  companyLogo: { type: String, required: false },
  companyType: { type: String, required: true },
  companySize: { type: String, required: true },
  companyIndustry: { type: String, required: true },
  commercialRegister: { type: String, required: true }, // Commercial Register
  taxId: { type: String, required: true }, // Tax ID
  vatNumber: { type: String, required: true }, // VAT Number
});

const Client = model("Client", clientSchema);
export default Client;

