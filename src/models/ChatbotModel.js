import { Schema, model } from "mongoose";

const chatbotSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      unique: true,
    },
    inquiries: [
      {
        question: {
          type: String,
          required: false,
        },
        answer: {
          type: String,
          required: false,
        },
        keywords: [String],
      },
    ],
  },
  { timestamps: true }
);

const Chatbot = model("Chatbot", chatbotSchema);
export default Chatbot;
