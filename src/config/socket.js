import { WebSocketServer } from "ws";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

import speech from "@google-cloud/speech";

const client = new speech.SpeechClient();

const request = {
  config: {
    encoding: "MULAW",
    sampleRateHertz: 16000,
    languageCode: "ar-SA",
  },
  interimResults: true,
};

wss.on("connection", (ws) => {
  console.log("New client connected");
  let recongnizeStream = null;

  ws.on("message", (message) => {
    console.log("Received message:", message);
    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log("Client connected");
        recongnizeStream = client
          .streamingRecognize(request)
          .on("error", (err) => {
            console.error("STT error:", err);
          })
          .on("data", (data) => {
            const transcription =
              data.results[0]?.alternatives[0]?.transcript || "";
            if (data.results[0]?.isFinal && transcription) {
              ws.send(
                JSON.stringify({ event: "transcription", data: transcription })
              );
            }
          });
        break;
      case "start":
        console.log("Client started");
        break;
      case "media":
        // console.log("Receiving Audio ");
        recongnizeStream.write(msg.media.payload);
        break;
      case "stop":
        console.log("Client stopped");
        recongnizeStream.destr();
        break;
    }
  });
});

export { app, server, wss };
