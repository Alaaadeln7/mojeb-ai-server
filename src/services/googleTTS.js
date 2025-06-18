import textToSpeech from "@google-cloud/text-to-speech";
import { config } from "dotenv";
config();

const TTSClient = new textToSpeech.TextToSpeechClient({
  credentials: process.env.GOOGLE_TEXT_TO_SPEECH,
});

export default TTSClient;
