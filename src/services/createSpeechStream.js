function createSpeechStream(onTranscription) {
  const recognizeStream = speechClient
    .streamingRecognize(request)
    .on("data", (data) => {
      const transcription = data.results[0]?.alternatives[0]?.transcript || "";
      if (data.results[0]?.isFinal && transcription) {
        onTranscription(transcription);
      }
    })
    .on("error", (err) => {
      console.error("STT error:", err);
    });

  return recognizeStream;
}

export default createSpeechStream;
