import { WebSocketServer } from "ws";
import http from "http";
import express from "express";
import { findAnswer } from "../helpers/findAnswer.js";
import { speakText } from "../helpers/speakText.js";
import speechClient from "../services/googleSTT.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const requestConfig = {
  config: {
    encoding: "MULAW",
    sampleRateHertz: 8000,
    languageCode: "en-US",
  },
  interimResults: false,
};

wss.on("connection", (ws) => {
  let recognizeStream = null;

  ws.on("message", async (message) => {
    const msg = JSON.parse(message);

    switch (msg.event) {
      case "connected":
        recognizeStream = speechClient
          .streamingRecognize(requestConfig)
          .on("error", (error) => {
            console.error("Recognition error:", error);
            ws.send(
              JSON.stringify({
                event: "error",
                message: "Speech recognition failed",
              })
            );
          })
          .on("data", async (data) => {
            const transcript = data.results[0]?.alternatives[0]?.transcript;
            if (transcript && data.results[0].isFinal) {
              console.log("User:", transcript);
              const answer = findAnswer(phone, transcript);
              if (answer) {
                console.log("Bot:", answer);
                await speakText(answer, ws);
              } else {
                console.log("Filler word or unclear.");
              }
            }
          });
        break;

      case "media":
        if (recognizeStream) {
          const audio = Buffer.from(msg.media.payload, "base64");
          recognizeStream.write(audio);
        }
        break;

      case "stop":
        ws.on("close", () => {
          if (recognizeStream) {
            recognizeStream.end();
            recognizeStream = null;
          }
        });
        break;
    }
  });
});
export { app, server, wss };
