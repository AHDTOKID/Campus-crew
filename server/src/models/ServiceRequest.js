import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ServiceRequest = model('ServiceRequest', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Other' },
    budgetMin: Number, budgetMax: Number, deadline: Date,
    status: { type: String, enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled'], default: 'open', index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    proposalCount: { type: Number, default: 0 },
}, { timestamps: true }));

export default ServiceRequest;