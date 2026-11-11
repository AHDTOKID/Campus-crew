import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Notice = model('Notice', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: String,
    category: { type: String, default: 'General' },
    sourceLabel: { type: String, enum: ['official', 'student'], default: 'student' },
    eventDate: Date, location: String, link: String, attachmentUrl: String,
    status: { type: String, enum: ['visible', 'hidden'], default: 'visible', index: true },
}, { timestamps: true }));

export default Notice;