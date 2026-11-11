import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const proposalSchema = new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    request: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true, index: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    deliveryDays: Number,
    message: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'withdrawn'], default: 'pending', index: true },
}, { timestamps: true });

proposalSchema.index({ request: 1, provider: 1 }, { unique: true });

const Proposal = model('Proposal', proposalSchema);

export default Proposal;