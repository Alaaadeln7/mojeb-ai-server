import {
  calculateExpiration,
  createChatbotForClient,
} from "../helpers/clientHelpers.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Client from "../models/ClientModel.js";
import Plan from "../models/PlanModel.js";
import Subscribe from "../models/SubscribeModel.js";
import User from "../models/UserModel.js";
import clientValidationSchema from "../utils/clientValidation.js";
import responseHandler from "../utils/response.js";
import bcrypt from "bcryptjs";

export const createClient = asyncHandler(async (req, res) => {
  const { error } = clientValidationSchema.validate(req.body);
  if (error) return responseHandler(res, 400, error.details[0].message);

  const {
    name,
    address,
    phone,
    email,
    password,
    website,
    description,
    size,
    industry,
    commercialRegister,
    taxId,
    planId,
  } = req.body;

  const existingClient = await Client.findOne({ email });
  if (existingClient) return responseHandler(res, 400, "Client already exists");

  const plan = await Plan.findById(planId);
  if (!plan) return responseHandler(res, 400, "Plan not found");

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    fullName: name,
    email,
    password: hashedPassword,
    role: "client",
  });

  const client = await Client.create({
    clientId: newUser._id,
    name,
    address,
    phone,
    email,
    website,
    description,
    size,
    industry,
    commercialRegister,
    taxId,
    planId,
  });

  // Create subscription
  const expireAt = calculateExpiration(plan.interval);
  const isActive = expireAt > new Date();
  const subscription = await Subscribe.create({
    user: client._id,
    plan: planId,
    expireAt,
    active: isActive,
    status: isActive ? "active" : "inactive",
  });

  // Create chatbot
  const chatbot = await createChatbotForClient(client._id);
  if (!chatbot) return responseHandler(res, 400, "Chatbot already exists");

  // Update client with references
  client.subscription = subscription._id;
  client.chatbotId = chatbot._id;
  await client.save();

  return responseHandler(res, 201, "Client created successfully");
});

export const getClients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || process.env.DEFAULT_PAGE_COUNT;
  const limit = parseInt(req.query.limit) || process.env.DEFAULT_LIMIT_COUNT;
  const skip = (page - 1) * limit;
  const totalClients = await Client.countDocuments();

  const clients = await Client.find()
    .skip(skip)
    .limit(limit)
    .populate({
      path: "subscription",
      select: "active expireAt",
    })
    .sort({ createdAt: -1 });

  const clientsWithActiveStatus = clients.map((client) => ({
    ...client.toObject(),
    isActive: client.subscription?.expireAt > new Date() || false,
  }));

  return responseHandler(res, 200, "Clients fetched successfully", {
    total: totalClients,
    page,
    limit,
    totalPages: Math.ceil(totalClients / limit),
    clients: clientsWithActiveStatus,
  });
});

export const getSingleClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findOne({ userId: id });
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

export const searchClient = asyncHandler(async (req, res) => {
  const search = req.params.search || "";

  const clients = await Client.find({
    name: { $regex: search, $options: "i" },
  });

  return responseHandler(res, 200, "Clients fetched successfully", clients);
});
