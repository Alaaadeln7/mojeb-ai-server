export default async function synthesizeSpeech(text) {
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
