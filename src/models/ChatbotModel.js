import { Schema, model } from "mongoose";

const chatbotSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
    unique: true,
  },
  knowledge: {
    type: Schema.Types.ObjectId,
    ref: "Knowledge",
    required: false,
  },
});

const Chatbot = model("Chatbot", chatbotSchema);
export default Chatbot;
