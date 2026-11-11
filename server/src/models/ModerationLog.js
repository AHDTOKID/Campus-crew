import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const moderationLogSchema = new Schema({
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetType: String,
    targetId: Schema.Types.ObjectId,
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', index: true },
    metadata: Schema.Types.Mixed,
}, { timestamps: true });

moderationLogSchema.index({ actor: 1, createdAt: -1 });

const ModerationLog = model('ModerationLog', moderationLogSchema);

export default ModerationLog;