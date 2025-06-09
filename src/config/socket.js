import { WebSocketServer } from "ws";
import http from "http";
import express from "express";
import speech from "@google-cloud/speech";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

const client = new speech.SpeechClient();

const request = {
  config: {
    encoding: "MULAW",
    sampleRateHertz: 8000,
    languageCode: "ar-SA",
  },
  interimResults: true,
};

wss.on("connection", (ws) => {
  console.log("New client connected");
  let recognizeStream = null;

  ws.on("message", (message) => {
    try {
      const msg = JSON.parse(message);
      switch (msg.event) {
        case "connected":
          console.log("Client connected");
          recognizeStream = client
            .streamingRecognize(request)
            .on("error", (err) => {
              console.error("STT error:", err);
            })
            .on("data", (data) => {
              const transcription =
                data.results[0]?.alternatives[0]?.transcript || "";
              if (data.results[0]?.isFinal && transcription) {
                ws.send(
                  JSON.stringify({
                    event: "transcription",
                    data: transcription,
                  })
                );
              }
            });
          break;

        case "start":
          console.log("Client started");
          break;

        case "media":
          if (recognizeStream && msg.media.payload) {
            const audioBuffer = Buffer.from(msg.media.payload, "base64");
            recognizeStream.write(audioBuffer);
          }
          console.log(Buffer.from(msg.media.payload, "base64"));
          break;

        case "stop":
          console.log("Client stopped");
          if (recognizeStream) {
            recognizeStream.destroy();
          }
          break;
      }
    } catch (err) {
      console.error("Invalid WebSocket message:", err);
    }
  });

  ws.on("close", () => {
    if (recognizeStream) recognizeStream.destroy();
    console.log("WebSocket connection closed");
  });
});

// ✅ Upgrade handler to support WebSocket path /ws
server.on("upgrade", (req, socket, head) => {
  if (req.url === "/ws") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

export { app, server, wss };
