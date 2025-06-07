import express from "express";
import twilio from "twilio";
import { answer, transcribe } from "../controllers/twilioController.js";

const router = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;

router.post("/voice", answer);
router.post("/transcribe", transcribe);
export default router;
