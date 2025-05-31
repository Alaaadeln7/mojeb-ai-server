import { Schema, model } from "mongoose";

const knowledgeSchema = new Schema(
  {
    chatbotId: {
      type: Schema.Types.ObjectId,
      ref: "Chatbot",
      required: true,
    },

    inquiries: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    keywords: [String],
  },
  { timestamps: true }
);

const Knowledge = model("Knowledge", knowledgeSchema);
export default Knowledge;
