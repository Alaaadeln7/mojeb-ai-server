import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs/promises";

const client = new textToSpeech.TextToSpeechClient();

export async function convertTextToSpeech(text) {
  const request = {
    input: { text },
    voice: { languageCode: "ar-XA", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);
  const fileName = `./output_${Date.now()}.mp3`;
  await fs.writeFile(fileName, response.audioContent, "binary");

  // لازم ترفعه على Storage أو Cloudinary علشان نرجعه كـ URL
  const publicUrl = await uploadToCloud(fileName);
  return publicUrl;
}
