import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const College = model('College', new Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    city: String, state: String, description: String,
    logoUrl: String, coverUrl: String,
    isPublished: { type: Boolean, default: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }));

export default College;