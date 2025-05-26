import asyncHandler from "../middlewares/asyncHandler.js";
import Client from "../models/ClientModel.js";
import User from "../models/UserModel.js";
import clientValidationSchema from "../utils/clientValidation.js";
import responseHandler from "../utils/response.js";

export const createClient = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const {
    companyName,
    companyAddress,
    companyPhone,
    companyEmail,
    companyWebsite,
    companyDescription,
    companySize,
    companyIndustry,
    commercialRegister,
    taxId,
  } = req.body;
  // validate the request body
  const { error } = clientValidationSchema.validate(req.body);
  if (error) {
    return responseHandler(res, 400, error.details[0].message);
  }
  // check if the client already exists
  const existingClient = await Client.findOne({ companyName });
  if (existingClient) {
    return responseHandler(res, 400, "Client already exists");
  }
  const client = await Client.create({
    user,
    companyName,
    companyAddress,
    companyPhone,
    companyEmail,
    companyWebsite,
    companyDescription,
    companySize,
    companyIndustry,
    commercialRegister,
    taxId,
  });

  const updatedUser = await User.findById(user);
  updatedUser.role = "client";
  await updatedUser.save();
  return responseHandler(res, 201, "Client created successfully");
});

export const getClients = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const clients = await Client.find({ user }).populate(
    "user",
    "fullName avatar email"
  );
  return responseHandler(res, 200, "Clients fetched successfully", clients);
});
export const getSingleClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id).populate(
    "user",
    "fullName avatar email"
  );
  if (!client) {
    return responseHandler(res, 404, "Client not found");
  }
  return responseHandler(res, 200, "Client fetched successfully", client);
});
export const updateClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findByIdAndUpdate(id, req.body, { new: true });
  if (!client) {
    return responseHandler(res, 404, "Client not found");
  }
  return responseHandler(res, 200, "Client updated successfully");
});
export const deleteClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findByIdAndDelete(id);
  if (!client) {
    return responseHandler(res, 404, "Client not found");
  }
  return responseHandler(res, 200, "Client deleted successfully");
});
