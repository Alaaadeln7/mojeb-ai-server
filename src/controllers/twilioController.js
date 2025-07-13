import asyncHandler from "../middlewares/asyncHandler.js";

export const voice = asyncHandler(async (req, res) => {
  const from = req.body.From;
  const to = req.body.To;
  console.log(from);
  console.log(to);
  res.set("Content-Type", "text/xml");
  res.send(`<Response>
        <Start>
          <Stream url="wss://${req.headers.host}/api/twilio/voice" />
        </Start>
        <Say>how can we help you</Say>
        <Pause length="60" />
      </Response>
    `);
});
