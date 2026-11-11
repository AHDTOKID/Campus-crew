import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MarketplaceItem = model('MarketplaceItem', new Schema({
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    category: { type: String, default: 'Other' },
    condition: { type: String, enum: ['new', 'like-new', 'good', 'fair'], default: 'good' },
    price: { type: Number, required: true },
    images: [String],
    status: { type: String, enum: ['available', 'reserved', 'sold', 'removed'], default: 'available', index: true },
    savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true }));

export default MarketplaceItem;