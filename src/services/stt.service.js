// services/speechToTextService.js
import speech from "@google-cloud/speech";
import fs from "fs";
import path from "path";

class SpeechToTextService {
  constructor() {
    this.client = new speech.SpeechClient({
      keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    });

    // Supported configurations
    this.configurations = {
      ARABIC: {
        languageCode: "ar-EG", // Egyptian Arabic
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
      },
      ENGLISH: {
        languageCode: "en-US",
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
      },
    };
  }

  /**
   * Converts audio file to text using Google Speech-to-Text API
   * @param {string} audioFilePath - Path to the audio file
   * @param {string} language - Language configuration key (default: 'ARABIC')
   * @returns {Promise<string>} - Extracted text
   * @throws {Error} - If audio processing fails
   */
  async convertAudioToText(audioFilePath, language = "ARABIC") {
    try {
      if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Audio file not found at path: ${audioFilePath}`);
      }

      const config =
        this.configurations[language.toUpperCase()] ||
        this.configurations.ARABIC;

      const audioContent = {
        content: fs.readFileSync(audioFilePath).toString("base64"),
      };

      const [response] = await this.client.recognize({
        audio: audioContent,
        config,
      });

      if (!response.results || response.results.length === 0) {
        throw new Error("No transcription results returned from Google API");
      }

      return response.results
        .map((result) => result.alternatives[0].transcript)
        .join(" ");
    } catch (error) {
      console.error(`Speech-to-Text conversion failed: ${error.message}`);
      throw error;
    }
  }
}

export default new SpeechToTextService();
