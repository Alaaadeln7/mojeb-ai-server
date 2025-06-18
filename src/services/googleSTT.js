import speech from "@google-cloud/speech";
import { config } from "dotenv";
config();

const STTClient = new speech.SpeechClient({
  credentials: process.env.GOOGLE_SPEECH_TO_TEXT,
});

export default STTClient;
