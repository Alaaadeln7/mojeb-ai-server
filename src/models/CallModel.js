import { Schema, model } from 'mongoose';

const callSchema = new Schema({});

const Call = model('Call', callSchema);

export default Call;