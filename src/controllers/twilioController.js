import asyncHandler from "../middlewares/asyncHandler.js";

export const voice = asyncHandler(async (req, res) => {
  res.set("Content-Type", "text/xml");

  res.send(
    ` <Response>
      <Start>
        <Stream url="wss://${req.headers.host}" />
      </Start>
      <Say>المساعد الذكي الأول للاتصالات: يمكنك من استقبال المكالمات وتحويلها إلى تذاكر أو إجراءات دون تدخل بشري.
	•	جاهزية فورية للعمل: بمجرد تفعيل مُجيب، يبدأ في خدمة عملائك دون تدريب أو إعداد معقد.
	•	توفير ساعات العمل: يُوفر وقت الفريق ويقلل من عدد المكالمات المتكررة بنسبة كبيرة.
	•	مراقبة وتحسين مستمر: تقارير دورية وتحليلات فورية لتقييم أداء الخدمة واتخاذ قرارات سريعة.</Say>
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
