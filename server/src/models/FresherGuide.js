import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const FresherGuide = model('FresherGuide', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
}, { timestamps: true }));

export default FresherGuide;