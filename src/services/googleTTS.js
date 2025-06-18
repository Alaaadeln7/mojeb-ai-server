import textToSpeech from "@google-cloud/text-to-speech";
import credentials from "./text-to-speech-google.json" assert { type: "json" };
const TTSClient = new textToSpeech.TextToSpeechClient({
  credentials,
});

export default TTSClient;
