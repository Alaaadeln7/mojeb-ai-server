import asyncHandler from "../middlewares/asyncHandler.js";
import twilio from "twilio";

export const voice = asyncHandler(async (req, res) => {
  res.set("Content-Type", "text/xml");

  res.send(
    ` <Response>
      <Start>
        <Stream url="wss://${req.headers.host}" />
      </Start>
      <Say>I will stream the next 60 seconds of audio</Say>
      <Pause length="60" />
    </Response>`
  );
});

// export const transcribe = asyncHandler(async (req, res) => {
//   const transcriptionText = req.body.TranscriptionText;

//   console.log("العميل قال:", transcriptionText);

//   // استخرج الرد المناسب من قاعدة البيانات
//   const response = await getAnswerFromDB(transcriptionText);

//   // حول النص إلى صوت بـ Google Cloud TTS
//   const audioUrl = await convertTextToSpeech(response);

//   // ابعت الصوت للعميل
//   const twiml = new twilio.twiml.VoiceResponse();
//   twiml.play(audioUrl);

//   res.type("text/xml");
//   res.send(twiml.toString());
// });
