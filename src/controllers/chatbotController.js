import asyncHandler from "../middlewares/asyncHandler.js";
import responseHandler from "../utils/response.js";
import Chatbot from "../models/ChatbotModel.js";
import textToSpeech from "@google-cloud/text-to-speech";
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

export const testAudio = asyncHandler(async (req, res) => {
  const client = new textToSpeech.TextToSpeechClient({
    credentials: {
      type: "service_account",
      project_id: "mujib-ai",
      private_key_id: "5fcda2608fad373b962bd96ea2576fad87b22c9d",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjiCr7OMqE9efe\nTu72G8LlDiUohhanYUs+2GBTzKAHZlBPBLJAARk2+80/wrE/rcJF7gURqyPEsedU\nR6oGIhza/mwpU/nkyiASu8oUE5WBVgNQ7R5Dtzqcskr1+ZaAsa2EA/17vaY1TB5K\nu062gOGr9WD5n3oZ7tCecVglo7yslP/eXnIYaqbYdTTiiP5G46nZ+CtHtGjhFnlH\nvxX+d1fpoq0/5zJNO5grBV0wQHhMjgC5cwJsYzp19CD+muLKx4TZyhA6ga1ywZa5\njMrWQCIoT1LwCHO1zl1F6xMOYy4yRjpGFJklXPIuOrX2uAB56AmoWjwjQrG8oSOw\nLbIQ7j8dAgMBAAECggEASICWjcsf/tMHegiE6ZhlUCh1UQIiCROZyMMl8gFG8gDq\nmh366WWTSE1bMmmfLBxdhaOBm9PEh/BYH4WmXBHDuVQToD8bC9SRY7zeWwhTwIPh\n9H8sa9lQoyhpE6UUlPoxc9ZRDAuJJRgaVge1XjTF2PdxhzqtZ9H5rEWUTxvJCrpO\n0rkVzSldrOrBFpXLrv/78viLK169Ionnnj3AulCwtjMiSjHZO8rFxqZHTc5Kt2No\n1q8jupZqGpgcHBc35FINpkj6UtU0OvnfiXtrkq5dn/PIqLjZO6bIbqfGtODM/A2A\nnOltQqMw2tDO02HOR+HMHkzZjJc3+fkTCAaE2Zh6AQKBgQDbu+L1Xp97bpjsLoMj\nOGCickeKheA4uJ+2+hAFsts8rTE/HutbJENVTxhJqxFavmliZNzA8CkauqSpyNrO\nwtL9Lne9lMVMa232O+SqgHFLxIVBsyFg4QHQZQwHz5l7ueaemD2t3F1mUMF2d4lZ\neumxLQJtE3PSkMrwbQqSO8O/MwKBgQC+haetKgMuCV0BpJi5vucFQ7QHEPdbAF3b\n41iEhhl4x2eg5roeXsjhuAOCJSJ+ffK2oRAaNctH5iVBvuJMdUJ38rwLWpp787+o\nWwXThhKkFCEcQ6fm8z+Lj8/puV1qmoldR2hPRFefDfPOZxIpcrqBFH9aHXmvp3UZ\nUHH0IZhIbwKBgCLV+LdZ1wLkl83p2dR9naRjZcAqVU/oxTlnD583qdZGxuXw6vM6\nHoqpzXnwawHt6hs1TmIwMPQR3wUj2Lyq2nRVJ5qguV7SMU62VBxL3Kpcb5vo4EPR\nqE33lx6t5PFemZdPH4guxYfxCZrUfKv49o+mSRot2VDqr6HKR8DDRNdNAoGAQ550\nMIVks4YnOFoOyn3yyG+LCab/45Bxv4Uk+YQOrks3gGfjTrwdV99Tf3FmmLZi2ma3\nrFXDXDVWq8rvzmsfuCqyiuURR0TvlPUZUEWZgBqU1c89XD6hIwtbo3xip19JuY2K\ne/epkY4GJg925rcNcpqvyHAFrE4mxWFD0H3L6okCgYEAuP0/g7q1fDJ0IXm9Yy9D\naDsNUiXzdltLoT4Qtica+rGYhg/1CrmMLkZahIv2FkKHwYbXbG0MAM3Zpq5SLW7U\n9sbGVqb/A2K6TWCPKEVa/71tUzslKG0zfsb+HoCQZyYCAixrta23PnqsqJ+6fSqt\nw33R0Z7PmKM1T7WL5d1iAj0=\n-----END PRIVATE KEY-----\n",
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
  const { text, languageCode, voiceName } = req.body;
  console.log(
    "credintials  google text to speech",
    process.env.GOOGLE_TEXT_TO_SPEECH
  );
  const request = {
    input: { text },
    voice: { languageCode, name: voiceName },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", response.audioContent.length);
    res.send(response.audioContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "TTS failed" });
  }
});
