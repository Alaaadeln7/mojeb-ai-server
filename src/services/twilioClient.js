import twilio from "twilio";
import { config } from "dotenv";
config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export const twilioClient = twilio(accountSid, authToken);
