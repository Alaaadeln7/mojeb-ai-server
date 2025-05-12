import KnowledgeBase from '../models/KnowledgeBaseModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import responseHandler from '../utils/response.js';
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
const client = new textToSpeech.TextToSpeechClient();

/**
 * @desc    Respond to a user question
 * @route   POST /api/chatbot/ask
 * @access  Public
 */
export const askBot = asyncHandler(async (req, res) => {

  const { question } = req.body;
  const foundQuestion = await KnowledgeBase.findOne({ question });

  if (foundQuestion) {
    if (foundQuestion) {
      const request = {
        input: { text: foundQuestion.answer },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      };
      const [response] = await client.synthesizeSpeech(request);

      const writeFile = util.promisify(fs.writeFile);
      await writeFile('output.mp3', response.audioContent, 'binary');
      console.log('Audio content written to file: output.mp3');

      return responseHandler(
        res,
        200,
        "Question found in the knowledge base"
        , { question: foundQuestion.question, answer: foundQuestion.answer });

    } else {
      return responseHandler(res, 404, "Question not found in the knowledge base", null);
    }
  }
});

/**
 * @desc    Add a new question and answer to the knowledge base
 * @route   POST /api/chatbot/add
 * @access  Public
 */
export const addQuestion = asyncHandler(async (req, res) => {

  const { question, answer } = req.body;

  const existingQuestion = await KnowledgeBase.findOne({ question });
  if (existingQuestion) {
    return res.status(400).json({ message: "The question already exists." });
  }

  const newEntry = new KnowledgeBase({ question, answer });
  await newEntry.save();

  return responseHandler(res, 201, "Question added successfully", newEntry);

});
