import asyncHandler from "../middlewares/asyncHandler.js";
import twilio from "twilio";
export const answer = asyncHandler(async (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml
    .start()
    .stream({ url: "wss://portfolioserver-0qyd.onrender.com/twilio/voice" });
  twiml.say(
    { voice: "woman", language: "ar-SA" },
    "مرحبا بك، يرجى التحدث الآن."
  );
  res.type("text/xml");
  res.send(twiml.toString());
});

export const transcribe = asyncHandler(async (req, res) => {
  const transcriptionText = req.body.TranscriptionText;

  console.log("العميل قال:", transcriptionText);

  // استخرج الرد المناسب من قاعدة البيانات
  const response = await getAnswerFromDB(transcriptionText);

  // حول النص إلى صوت بـ Google Cloud TTS
  const audioUrl = await convertTextToSpeech(response);

  // ابعت الصوت للعميل
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.play(audioUrl);

  res.type("text/xml");
  res.send(twiml.toString());
});
