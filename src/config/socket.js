import { WebSocketServer } from "ws";
import http from "http";
import express from "express";
import speech from "@google-cloud/speech";
import textToSpeech from "@google-cloud/text-to-speech";
import { Writable } from "stream";
import createSpeechStream from "../services/createSpeechStream.js";

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server });

// Initialize Google Cloud clients
const speechRecognitionClient = new speech.SpeechClient();
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

// Track active user connections
const activeUserConnections = new Map();

// Knowledge base for bot responses
const botKnowledgeBase = {
  "what is your name": "I am your virtual assistant.",
  "how are you": "I'm doing well, thank you for asking.",
  // Add more question-response pairs as needed
};

/**
 * Converts text to speech audio
 * @param {string} text - Text to convert to speech
 * @returns {Promise<Buffer>} - Audio buffer containing synthesized speech
 */
async function synthesizeSpeech(text) {
  const request = {
    input: { text },
    voice: {
      languageCode: "ar-SA", // Arabic (Saudi Arabia)
      ssmlGender: "FEMALE",
    },
    audioConfig: {
      audioEncoding: "MULAW",
      sampleRateHertz: 8000,
    },
  };

  const [response] = await textToSpeechClient.synthesizeSpeech(request);
  return response.audioContent;
}

/**
 * Sends audio data to Twilio via WebSocket
 * @param {WebSocket} webSocket - Active WebSocket connection
 * @param {Buffer} audioBuffer - Audio data to send
 */
async function sendAudioToClient(webSocket, audioBuffer) {
  const message = {
    event: "media",
    media: {
      payload: audioBuffer.toString("base64"),
    },
  };

  if (webSocket.readyState === webSocket.OPEN) {
    webSocket.send(JSON.stringify(message));
  }
}

// Handle new WebSocket connections
webSocketServer.on("connection", (webSocket) => {
  console.log("New client connected via WebSocket");

  // Initialize speech recognition stream
  const speechRecognitionStream = createSpeechStream(async (transcription) => {
    console.log(" Converted text:", transcription);

    // Get appropriate response from knowledge base
    const responseText =
      botKnowledgeBase[transcription.trim().toLowerCase()] ||
      "Sorry, I didn't understand your question.";

    // Convert response to speech and send to client
    const audioResponse = await synthesizeSpeech(responseText);
    await sendAudioToClient(webSocket, audioResponse);
  });

  // Handle incoming messages
  webSocket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.event === "media" && parsedMessage.media.payload) {
        const audioData = Buffer.from(parsedMessage.media.payload, "base64");
        speechRecognitionStream.write(audioData);
      }
    } catch (error) {
      console.error("Invalid message format:", error);
    }
  });

  // Handle connection closing
  webSocket.on("close", () => {
    speechRecognitionStream.destroy();
    console.log("WebSocket connection closed");
  });
});

export { app, server, webSocketServer };
