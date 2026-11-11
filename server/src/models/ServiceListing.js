import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ServiceListing = model('ServiceListing', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    category: { type: String, default: 'Other' },
    price: Number,
    priceBasis: { type: String, default: 'starting-at' },
    portfolioLinks: [String],
    active: { type: Boolean, default: true },
}, { timestamps: true }));

export default ServiceListing;