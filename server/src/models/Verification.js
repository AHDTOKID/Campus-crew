import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const verificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true },
    method: { type: String, enum: ['institutional-email', 'manual'], default: 'manual' },
    studentIdUrl: String,
    note: String,
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending', index: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: Date,
    decisionReason: String,
}, { timestamps: true });

verificationSchema.index({ status: 1, createdAt: -1 });

const Verification = model('Verification', verificationSchema);

export default Verification;