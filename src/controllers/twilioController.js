import asyncHandler from "../middlewares/asyncHandler.js";

export const voice = asyncHandler(async (req, res) => {
  res.set("Content-Type", "text/xml");

  res.send(
    `<Response>
      <Start>
        <Stream url="wss://portfolioserver-0qyd.onrender.com/ws" />
      </Start>
     <Say voice="man" language="ar-SA">
        المساعد الذكي الأول للاتصالات: يمكنك من استقبال المكالمات وتحويلها إلى تذاكر أو إجراءات دون تدخل بشري.
        • جاهزية فورية للعمل: بمجرد تفعيل مُجيب، يبدأ في خدمة عملائك دون تدريب أو إعداد معقد.
        • توفير ساعات العمل: يُوفر وقت الفريق ويقلل من عدد المكالمات المتكررة بنسبة كبيرة.
        • مراقبة وتحسين مستمر: تقارير دورية وتحليلات فورية لتقييم أداء الخدمة واتخاذ قرارات سريعة.
      </Say>
      <Pause length="1" />
    </Response>`
  );
});
