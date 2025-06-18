import Chatbot from "../models/ChatbotModel.js";

export const calculateExpiration = (interval) => {
  const date = new Date();
  const daysToAdd = interval === "monthly" ? 30 : 365;
  date.setDate(date.getDate() + daysToAdd);
  return date;
};

export const createChatbotForClient = async (clientId) => {
  if (await Chatbot.findOne({ clientId })) return null;
  return await Chatbot.create({ clientId });
};
