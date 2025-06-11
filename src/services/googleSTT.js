import speech from "@google-cloud/speech";

const client = new speech.SpeechClient({
  credentials: {
    client_email: process.env.CLIENT_GOOGLE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY_STT.replace(/\\n/g, "\n"),
  },
});

export default client;
