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
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
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
  const client = await Client.findOne({ clientId: id });
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

export const toggleEmailNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);
  if (!client) {
    return responseHandler(res, 404, "Client not found");
  }
  client.emailNotification = !client.emailNotification;
  await client.save();
  return responseHandler(res, 200, "Email notification updated successfully");
});

export const togglePlanUsageAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);
  if (!client) {
    return responseHandler(res, 404, "Client not found");
  }
  client.planUsageAlert = !client.planUsageAlert;
  await client.save();
  return responseHandler(res, 200, "plan usage alert updated successfully");
});

export const togglePerformanceReports = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);
  if (!client) {
    return responseHandler(res, 404, "Client not found");
  }
  client.performanceReports = !client.performanceReports;
  await client.save();
  return responseHandler(res, 200, "preformance reports updated successfully");
});

export const toggleTicketEscalationAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);
  if (!client) {
    return responseHandler(res, 404, "Client not found");
  }
  client.ticketEscalationAlert = !client.ticketEscalationAlert;
  await client.save();
  return responseHandler(
    res,
    200,
    "ticket escalation alert updated successfully"
  );
});

// start integrations

// integration with whatsapp
// export const whatsappIntegration = asyncHandler(async (req, res) => {
//   // the integration have three steps
//   // 1. verify the client phone number
//   // 3. like with whatsapp to send custom message from mojeeb
//   // 2. update the property in the database to know the client integrated or not
//   // 4. return integration in successfully
//   await fetch("https://graph.facebook.com/v22.0/701290009743185/messages", {
//     headers: {
//       Authorization:
//         "Bearer EAAIpKU36oXMBPB5MXNxKvfkpKPXmgfSF4iL6pGBnfJZBrsxIqRjTZAVLCzE8RYSJTCrD3ZC2LOb4Erewvk8EQLGJzchImu0y8XVBQTff809JP0d9v2tljvrBYh2JAqeZAYTboG5Q6VZBlfnWi6AZAqJfoiiGoXYjlUahZCkw34lw92PuUZC1sePjdLNHH6hoMZCZCQYe98iYtQZAlna30DikMu3bSIfuDnPjbB2ZCYsyYzZAYeQZDZD",
//       "Content-Type": " application/json",
//       body: JSON.stringify({
//         messaging_product: "whatsapp",
//         to: "201220882843",
//         type: "template",
//         template: {
//           name: "hello_world",
//           language: { code: "en_US" },
//         },
//       }),
//     },
//   });

//   return responseHandler(res, 200, "successfully integration with whatsapp");
// });
export const whatsappIntegration = asyncHandler(async (req, res) => {
  const response = await fetch(process.env.WHATSAPP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "201220882843",
      type: "template",
      template: {
        name: "welcome",
        language: { code: "ar" },
        components: [
          {
            type: "header",
            parameters: [
              { type: "text", text: "أحمد" }, // client_name
            ],
          },
          {
            type: "body",
            parameters: [
              { type: "text", text: "+20123456789" }, // client_phonenumber
              { type: "text", text: "2025-08-15" }, // date
            ],
          },
        ],
      },
    }),
  });

  console.log("WhatsApp API Response:", response);

  return responseHandler(res, 200, "successfully integration with whatsapp");
});

// end integrations
