import { Schema, model } from 'mongoose';

const knowledgeSchema = new Schema({
  question: {
    type: String,
    required: true,
    unique: true,
  },
  answer: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const KnowledgeBase = model('KnowledgeBase', knowledgeSchema);
export default KnowledgeBase;