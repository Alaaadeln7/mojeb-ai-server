import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../utils/response.js";
import Chatbot from "../models/ChatbotModel.js";

// Get chatbot by clientId
export const getChatbot = asyncHandler(async (req, res) => {
  const { chatbotId } = req.params;
  const chatbot = await Chatbot.findById(chatbotId);

  if (!chatbot) {
    return responseHandler(res, 404, "Chatbot not found");
  }

  return responseHandler(res, 200, "Chatbot fetched successfully", chatbot);
});

// Add new inquiry to chatbot
export const addInquiry = asyncHandler(async (req, res) => {
  const { question, answer, chatbotId } = req.body;

  const chatbot = await Chatbot.findById(chatbotId);
  if (!chatbot) {
    return responseHandler(res, 404, "Chatbot not found");
  }

  chatbot.inquiries.push({ question, answer });
  await chatbot.save();

  return responseHandler(res, 201, "Inquiry added successfully", chatbot);
});

// Update existing inquiry
export const updateInquiry = asyncHandler(async (req, res) => {
  const { chatbotId, inquiryId } = req.params;
  const { question, answer } = req.body;

  const chatbot = await Chatbot.findById(chatbotId);
  if (!chatbot) {
    return responseHandler(res, 404, "Chatbot not found");
  }

  const inquiry = chatbot.inquiries.id(inquiryId);
  if (!inquiry) {
    return responseHandler(res, 404, "Inquiry not found");
  }

  if (question) inquiry.question = question;
  if (answer) inquiry.answer = answer;

  await chatbot.save();
  return responseHandler(res, 200, "Inquiry updated successfully", chatbot);
});

// Delete inquiry from chatbot
export const deleteInquiry = asyncHandler(async (req, res) => {
  const { chatbotId, inquiryId } = req.body;

  const chatbot = await Chatbot.findById(chatbotId);
  if (!chatbot) {
    return responseHandler(res, 404, "Chatbot not found");
  }

  chatbot.inquiries.pull(inquiryId);
  await chatbot.save();

  return responseHandler(res, 200, "Inquiry deleted successfully", chatbot);
});
