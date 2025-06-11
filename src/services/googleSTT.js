import speech from "@google-cloud/speech";
import { config } from "dotenv";
config();
const client = new speech.SpeechClient({
  credentials: {
    client_email: process.env.CLIENT_GOOGLE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY_STT,
  },
});
export default client;
