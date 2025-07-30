import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../utils/response.js";
import Chatbot from "../models/ChatbotModel.js";
import textToSpeech from "@google-cloud/text-to-speech";

// Get chatbot by clientId
export const getChatbot = asyncHandler(async (req, res) => {
  const { chatbotId } = req.params;
  const page =
    parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE_COUNT) || 1;
  const limit =
    parseInt(req.query.limit) ||
    parseInt(process.env.DEFAULT_LIMIT_COUNT) ||
    10;
  const skip = (page - 1) * limit;

  const chatbotDoc = await Chatbot.findById(chatbotId);

  if (!chatbotDoc) {
    return responseHandler(res, 404, "Chatbot not found");
  }

  const total = chatbotDoc.inquiries?.length || 0;
  const paginatedInquiries =
    chatbotDoc.inquiries?.slice(skip, skip + limit) || [];

  return responseHandler(res, 200, "Chatbot fetched successfully", {
    total,
    page,
    limit,
    description: chatbotDoc.description,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
    data: paginatedInquiries,
  });
});

// Add new inquiry to chatbot
export const addInquiry = asyncHandler(async (req, res) => {
  const { question, answer, chatbotId, keyword } = req.body;

  const chatbot = await Chatbot.findById(chatbotId);
  if (!chatbot) {
    return responseHandler(res, 404, "Chatbot not found");
  }
  const exists = chatbot.inquiries.some(
    (inq) => inq.question === question || inq.keyword === keyword
  );

  if (exists) {
    return responseHandler(
      res,
      400,
      "Inquiry with same question or keyword already exists"
    );
  }
  chatbot.inquiries.push({ question, answer, keyword });
  await chatbot.save();

  return responseHandler(res, 201, "Inquiry added successfully");
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const { question, answer, chatbotId, inquiryId, keyword } = req.body;

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
  if (keyword) inquiry.keyword = keyword;
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

export const addDescription = asyncHandler(async (req, res) => {
  const { description, chatbotId } = req.body;
  const chatbot = await Chatbot.findById(chatbotId);
  if (!chatbot) {
    return responseHandler(res, 404, "Chatbot not found");
  }
  chatbot.description = description;
  await chatbot.save();
  return responseHandler(res, 200, "Description added successfully");
});

export const testAudio = asyncHandler(async (req, res) => {
  const client = new textToSpeech.TextToSpeechClient({
    credentials: {
      type: "service_account",
      project_id: "mujib-ai",
      private_key_id: "992dab131e12896e6ceb1fcb2d595234b133b7fb",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPuB4kfxd5d//5\ntSWNgOyHzOJmS0YHbQcUZO40BNkCkZ0L1/K/HupHV2oucgf42a7F1A6gA+mqO08g\nlETtIoOfc/IdRd9+K1tnNwcSofusOEk/zyfPdlQ66LtgMdTzP/+R0FqFErSJnOVZ\nddbAv3Bi3s//6TV3OP2ZqLsYMaQzLbiDOsvECd/tymTyl/qxDgeeEp5tfn6Jn+rf\nbpDSu6cBVMUe2iEBHYoe//tyLO21BY8HEGW1XqnjGQq4Pyuz+2Iq/i8zfr09BKRz\nCRmnrGueZshZ4HGlJKMf1nsotULJzDZyiqn5kY0gUsY4PH/PMiKVJg6PH2CN0y9p\npX3KzSZvAgMBAAECggEADZmth5A2tkJQJUZiDhDJ695TWIVHMYdG9mPhYNCMcOmd\n0b+y6iaZClDD6ASZVwbRtaw7xOhcrUOy25w5oxkmaxNJX/dKOdWW53wn32VxuAX7\nbc0feyrxOuYwFo1MtxySnDZ7JslhvrziG2hmxjoCnsad8dCQKp01pZDxpxTg/mS6\nu/wqlATGv4BrHRnnnXedZRphWeTfOTztwUlImXIhmIrojY89lSiBbtDUek6UOtBS\nFUTsm6lp6T3JXGm94xXUfNmJeICFCCMpbwS69MnVlaf8iinGPHxXVBPD5UBnAHT9\nELR/+bZv/xHQBINa0BbjGrtkvvqgeQ3L3U2tJBO5kQKBgQDxs32RxDx7z7IaVivP\nU5YvXxfuTKqU0QXiL+pntzsJ6LvpuGwTeidb7Pxpf+OXb5skeMLIUo+nsVkst5pB\nTXB698BzMyJ0NnP4D+Ze7R3wUrWkxxwqfM09WUh+4RhpDtRTIjAbN2U13OzjI46P\nud6PGcFJCEqS7zWMG7v6o6U/9wKBgQDcAfqF71/t6j2aC/w0eIo6ZzQNt9A1AVFe\nZ2KjfFijnlL9YNWN1N88YA47T/Lq63nBRBYE65ttqYEwQuuI7UVszCXKrOWmWp06\nP1R8thg2t6RcLnW97LT0hDUYFIaznbxQ/J4NSL2we+g9BzvZU5HKJy8b5Eu8387N\naw2zA8kfSQKBgHS1A7QH+mCaWFiJNVxF8yXql+aUFGYJS/r8wgXUnuhY/auMRntd\nJ3Ymx3a1rxKnbFU/DmamHwGNDA8glJZlqyNlUAMQNNnClVq5arZ5blRly5nGHt6R\nJpUx8GR7kkrgQzvlLS9nHzLT+3pt59+Uk1eryv3VyBSM9uExXyJWNGvfAoGAQy4n\nfbZ2qIOag+uc+7jDHMpezsGORmE8o4MWT62ss2mpFc335/NUp279aYckOi/lYeqU\nfrQjJf1YgZAttAYf6PT9pUHebknFMQAdoGdKRYsWGT/mnDQnnXKxc8TwzPAhjOlW\nqd/IbJepdtk6oUYvgncsn2u65NXCpF9IM524UGECgYEAl1v3W1nr+rZKDDANDAZ3\nhAlmpNVVzDwZXZyIcpYlIZkX4Viq3PQX6qmltfZ8i+xI0+dV99gSi//70bUSRP7h\nEFz/zwh8bWN0qeWR07qJOmFYuxGLbVKYCJrTUtqjWNt+i6vnaHz566vG7MxI07B6\nRW1DDkNpWw3e49PYHoPXrA4=\n-----END PRIVATE KEY-----\n",
      client_email: "op-demo@mujib-ai.iam.gserviceaccount.com",
      client_id: "108203808526788365034",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/op-demo%40mujib-ai.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    },
  });
  const { text, languageCode, voice } = req.body;
  console.log(text, languageCode, voice);
  const request = {
    input: { text },
    voice: { languageCode, name: voice },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", response.audioContent.length);
    res.send(response.audioContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed" + error });
  }
});
