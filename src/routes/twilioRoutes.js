import express from "express";
import twilio from "twilio";
import {
  voice,
  // transcribe
} from "../controllers/twilioController.js";

const router = express.Router();

router.post("/voice", voice);
// router.post("/transcribe", transcribe);
export default router;
