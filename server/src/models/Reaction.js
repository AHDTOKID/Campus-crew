import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const reactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['post', 'comment'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, default: 'like' },
}, { timestamps: true });

reactionSchema.index({ userId: 1, targetType: 1, targetId: 1, type: 1 }, { unique: true });

const Reaction = model('Reaction', reactionSchema);

export default Reaction;