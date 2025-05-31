import asyncHandler from "../middlewares/asyncHandler.js";
import Chatbot from "../models/ChatbotModel.js";
import Client from "../models/ClientModel.js";
import Knowledge from "../models/KnowledgeModel.js";
import Plan from "../models/PlanModel.js";
import Subscribe from "../models/SubscribeModel.js";
import User from "../models/UserModel.js";
import clientValidationSchema from "../utils/clientValidation.js";
import responseHandler from "../utils/response.js";
import bcrypt from "bcryptjs";

export const createClient = asyncHandler(async (req, res) => {
  const { error } = clientValidationSchema.validate(req.body);
  if (error) {
    return responseHandler(res, 400, error.details[0].message);
  }

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

  // Check if client already exists
  const existingClient = await Client.findOne({ name });
  if (existingClient) {
    return responseHandler(res, 400, "Client already exists");
  }

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

  const plan = await Plan.findById(planId);
  if (!plan) {
    return responseHandler(res, 400, "Plan not found");
  }

  let expireAt = new Date();
  const subscription = await Subscribe.create({
    user: client._id,
    plan: planId,
    expireAt: expireAt.setDate(
      expireAt.getDate() + (plan.interval === "monthly" ? 30 : 365)
    ),
    active: expireAt > new Date(),
  });

  // Attach subscription to client
  client.subscription = subscription._id;

  // Ensure chatbot doesn't already exist for this client
  const existingChatbot = await Chatbot.findOne({ clientId: client._id });
  if (existingChatbot) {
    return responseHandler(res, 400, "Chatbot already exists");
  }

  // Create chatbot and knowledge base
  const newChatbot = await Chatbot.create({ clientId: client._id });
  const newKnowledge = await Knowledge.create({ chatbotId: newChatbot._id });
  newChatbot.knowledge = newKnowledge._id;
  await newChatbot.save();

  // Attach chatbot to client
  client.chatbot = newChatbot._id;
  await client.save();

  return responseHandler(res, 201, "Client created successfully");
});

export const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find()
    .populate({
      path: "subscription",
      select: "active expireAt",
    })
    .sort({ createdAt: -1 });

  const clientsWithActiveStatus = clients.map((client) => ({
    ...client.toObject(),
    isActive: client.subscription?.expireAt > new Date() || false,
  }));

  return responseHandler(
    res,
    200,
    "Clients fetched successfully",
    clientsWithActiveStatus
  );
});
export const getSingleClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);
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
