import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Message = model('Message', new Schema({
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true }));

export default Message;