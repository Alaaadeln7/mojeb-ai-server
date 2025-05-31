import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../utils/response.js";
import Chatbot from "../models/ChatbotModel.js";
import Knowledge from "../models/KnowledgeModel.js";

export const getChatbot = asyncHandler(async (req, res) => {
  const { clientId } = req.params;

  const chatbot = await Chatbot.findOne({ clientId })
    .populate("knowledge")
    .select(" -__v");

  if (!chatbot) {
    return responseHandler(res, 404, "Chatbot not found");
  }

  return responseHandler(res, 200, "Chatbot fetched successfully", chatbot);
});

export const addInquiry = asyncHandler(async (req, res) => {
  const { chatbotId } = req.params;
  const { question, answer } = req.body;

  const knowledge = await Knowledge.findOne({ chatbotId });
  console.log(knowledge);
  console.log(chatbotId);
  if (!knowledge) {
    return responseHandler(res, 404, "Knowledge not found");
  }

  knowledge.inquiries.push({ question, answer });
  await knowledge.save();

  return responseHandler(res, 200, "Inquiry added successfully", knowledge);
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const { chatbotId, index } = req.params;
  const { question, answer } = req.body;

  const knowledge = await Knowledge.findOne({ chatbotId });
  if (!knowledge) {
    return responseHandler(res, 404, "Knowledge not found");
  }

  if (!knowledge.inquiries[index]) {
    return responseHandler(res, 404, "Inquiry not found");
  }

  if (question) knowledge.inquiries[index].question = question;
  if (answer) knowledge.inquiries[index].answer = answer;

  await knowledge.save();

  return responseHandler(res, 200, "Inquiry updated successfully", knowledge);
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  const { inquiryId } = req.params;

  const knowledge = await Knowledge.findOne({ inquiryId });
  if (!knowledge) {
    return responseHandler(res, 404, "Knowledge not found");
  }

  if (!knowledge.inquiries[index]) {
    return responseHandler(res, 404, "Inquiry not found");
  }

  knowledge.inquiries.splice(index, 1);
  await knowledge.save();

  return responseHandler(res, 200, "Inquiry deleted successfully", knowledge);
});
