const { default: Chatbot } = require("../models/ChatbotModel");
const Question = require("../models/Question");

/**
 * Tries to match a spoken question with a stored one.
 * @param {string} input - Text coming from STT (Speech-to-Text)
 * @param {string} userId - The user ID that the questions belong to
 * @returns {string|null} - The answer or null if not found
 */
export const matchClientInquiry = async (input, clientId) => {
  const chatbot = await Chatbot.findOne({ clientId }).populate("knowledge");

  if (!chatbot || !chatbot.knowledge) return null;

  const inputLower = input.toLowerCase();

  for (let inquiry of chatbot.knowledge.inquiries) {
    const question = inquiry.question.toLowerCase();

    if (inputLower.includes(question)) {
      return inquiry.answer;
    }
  }

  for (let keyword of chatbot.knowledge.keywords) {
    if (inputLower.includes(keyword.toLowerCase())) {
      const inquiry = chatbot.knowledge.inquiries.find((inq) =>
        inq.question.toLowerCase().includes(keyword.toLowerCase())
      );
      return inquiry ? inquiry.answer : null;
    }
  }

  return null;
};
