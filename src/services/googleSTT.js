import speech from "@google-cloud/speech";
import credentials from "./speech-to-text-google.json" assert { type: "json" };

const STTClient = new speech.SpeechClient({
  credentials,
});

export default STTClient;
