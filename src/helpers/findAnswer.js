import Chatbot from "../models/ChatbotModel.js";
import Client from "../models/ClientModel.js";

function findAnswerInInquiries(inquiries, transcript) {
  if (!inquiries || inquiries.length === 0) {
    return "Sorry, I don't have any information yet.";
  }

  const cleanedQuestion = transcript.toLowerCase().trim();
  let bestMatch = { rating: 0, answer: null };

  for (const inquiry of inquiries) {
    if (!inquiry.question || !inquiry.answer) continue;

    // 1. Check exact match
    const inquiryQuestion = inquiry.question.toLowerCase().trim();
    if (inquiryQuestion === cleanedQuestion) {
      return inquiry.answer;
    }

    // 2. Check keyword matches
    if (inquiry.keyword) {
      const keywords = inquiry.keyword.toLowerCase().split(",");
      if (
        keywords.some((keyword) => cleanedQuestion.includes(keyword.trim()))
      ) {
        return inquiry.answer;
      }
    }

    // 3. Check similarity as fallback
    const similarity = stringSimilarity.compareTwoStrings(
      cleanedQuestion,
      inquiryQuestion
    );

    if (similarity > bestMatch.rating) {
      bestMatch = { rating: similarity, answer: inquiry.answer };
    }
  }

  return bestMatch.rating > 0.6
    ? bestMatch.answer
    : "Sorry, I couldn't find an answer to your question.";
}

export const findAnswer = async function (phone, transcript) {
  try {
    console.log(phone);
    const client = await Client.findOne({ phone });
    console.log(client);
    if (!client) {
      return "Client not found.";
    }

    const chatbot = await Chatbot.findById(client?.chatbotId);

    if (!chatbot) {
      return "Chatbot not configured for this client.";
    }

    return findAnswerInInquiries(chatbot.inquiries, transcript);
  } catch (error) {
    console.error("Error finding chatbot response:", error);
    return "Sorry, I'm having trouble answering right now.";
  }
};
//  get the answer from the chatbot with phone number
