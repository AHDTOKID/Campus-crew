import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Report = model('Report', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', index: true },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['post', 'comment', 'listing', 'message', 'review'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'reviewed', 'dismissed'], default: 'open', index: true },
    decision: String,
}, { timestamps: true }));

export default Report;