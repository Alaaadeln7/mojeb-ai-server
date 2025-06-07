export default async function sendAudioToClient(webSocket, audioBuffer) {
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
