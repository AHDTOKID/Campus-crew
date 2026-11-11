import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Conversation = model('Conversation', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessageAt: { type: Date, default: Date.now, index: true },
    lastMessage: String,
}, { timestamps: true }));

export default Conversation;