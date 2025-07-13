import TTSClient from "../services/googleTTS.js";

export async function speakText(text, ws) {
  try {
    const request = {
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MULAW", sampleRateHertz: 8000 },
    };
    ws.send(
      JSON.stringify({
        event: "start",
        media: {
          sampleRateHertz: 8000,
          audioEncoding: "MULAW",
          channels: 1,
        },
      })
    );
    const [response] = await TTSClient.synthesizeSpeech(request);
    const audioBuffer = Buffer.from(response.audioContent);
    const chunkSize = 320;
    const chunkDurationMs = 40;

    for (let i = 0; i < audioBuffer.length; i += chunkSize) {
      const chunk = audioBuffer.slice(i, i + chunkSize);
      ws.send(
        JSON.stringify({
          event: "media",
          media: { payload: chunk.toString("base64") },
        })
      );
      await new Promise((r) => setTimeout(r, chunkDurationMs));
    }
    ws.send(JSON.stringify({ event: "stop" }));
  } catch (error) {
    console.error("Error in speakText:", error);
    ws.send(JSON.stringify({ event: "error", message: error.message }));
  }
}
