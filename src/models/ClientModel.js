import { Schema, model } from "mongoose";

const clientSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      unique: true,
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, required: false },
    description: { type: String, required: true },
    size: { type: String, required: false },
    industry: { type: String, required: true },
    commercialRegister: { type: String, required: true },
    taxId: { type: String, required: true },
    chatbotId: {
      type: Schema.Types.ObjectId,
      ref: "Chatbot",
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscribe",
    },
    emailNotification: { type: Boolean, default: false },
    planUsageAlert: { type: Boolean, default: false },
    performanceReports: { type: Boolean, default: false },
    ticketEscalationAlert: { type: Boolean, default: false },
    slackUserId: { type: String, required: false },
    slackAccessToken: { type: String, required: false },
  },
  { timestamps: true }
);

const Client = model("Client", clientSchema);
export default Client;
