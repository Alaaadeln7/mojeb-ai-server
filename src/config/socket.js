// import { WebSocketServer } from "ws";
// import http from "http";
import express from "express";

export const app = express();
// const server = http.createServer(app);
// const wss = new WebSocketServer({ server });

// const requestConfig = {
//   config: {
//     encoding: "MULAW",
//     sampleRateHertz: 8000,
//     languageCode: "en-US",
//   },
//   interimResults: false,
// };

// function findAnswer(transcript) {
//   const fillerWords = [
//     "okay",
//     "ok",
//     "yup",
//     "yes",
//     "alright",
//     "hmm",
//     "yeah",
//     "sure",
//     "uh-huh",
//   ];
//   const cleaned = transcript.toLowerCase().trim().split(" ");
//   const filtered = cleaned
//     .filter((word) => !fillerWords.includes(word))
//     .join(" ");

//   for (const qa of qaDataset) {
//     const keywords = qa.question.toLowerCase().split(" ");
//     if (keywords.some((keyword) => filtered.includes(keyword))) {
//       return qa.answer;
//     }
//   }
//   return "Sorry, I didn't understand that.";
// }

// async function speakText(text, ws) {
//   try {
//     const request = {
//       input: { text },
//       voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
//       audioConfig: { audioEncoding: "MULAW", sampleRateHertz: 8000 },
//     };

//     ws.send(
//       JSON.stringify({
//         event: "start",
//         media: {
//           sampleRateHertz: 8000,
//           audioEncoding: "MULAW",
//           channels: 1,
//         },
//       })
//     );

//     const [response] = await ttsClient.synthesizeSpeech(request);
//     const audioBuffer = Buffer.from(response.audioContent);
//     const chunkSize = 320;
//     const chunkDurationMs = 40;

//     for (let i = 0; i < audioBuffer.length; i += chunkSize) {
//       const chunk = audioBuffer.slice(i, i + chunkSize);
//       ws.send(
//         JSON.stringify({
//           event: "media",
//           media: { payload: chunk.toString("base64") },
//         })
//       );
//       await new Promise((r) => setTimeout(r, chunkDurationMs));
//     }

//     ws.send(JSON.stringify({ event: "stop" }));
//   } catch (error) {
//     console.error("Error in speakText:", error);
//     ws.send(JSON.stringify({ event: "error", message: error.message }));
//   }
// }

// wss.on("connection", (ws) => {
//   let recognizeStream = null;

//   ws.on("message", async (message) => {
//     const msg = JSON.parse(message);

//     switch (msg.event) {
//       case "connected":
//         recognizeStream = speechClient
//           .streamingRecognize(requestConfig)
//           .on("error", (error) => {
//             console.error("Recognition error:", error);
//             ws.send(
//               JSON.stringify({
//                 event: "error",
//                 message: "Speech recognition failed",
//               })
//             );
//           })
//           .on("data", async (data) => {
//             const transcript = data.results[0]?.alternatives[0]?.transcript;
//             if (transcript && data.results[0].isFinal) {
//               console.log("User:", transcript);
//               const answer = findAnswer(transcript);
//               if (answer) {
//                 console.log("Bot:", answer);
//                 await speakText(answer, ws);
//               } else {
//                 console.log("Filler word or unclear.");
//               }
//             }
//           });
//         break;

//       case "media":
//         if (recognizeStream) {
//           const audio = Buffer.from(msg.media.payload, "base64");
//           recognizeStream.write(audio);
//         }
//         break;

//       case "stop":
//         if (recognizeStream) recognizeStream.end();
//         break;
//     }
//   });
// });

// export { app, server, wss };

// app
