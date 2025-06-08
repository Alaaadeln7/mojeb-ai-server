import express from "express";
import { voice } from "../controllers/twilioController.js";

const router = express.Router();

router.post("/voice", voice);
export default router;
