import Verification from '../models/Verification.js';
import User from '../models/User.js';
import ModerationLog from '../models/ModerationLog.js';
import { ApiError } from '../utils/ApiError.js';
import { notifyUser } from './notification.service.js';

export async function submitVerification(user, { studentIdUrl, note }) {
    if (!user.collegeId) throw ApiError.badRequest('Select a college first');
    const v = await Verification.create({
        userId: user._id, collegeId: user.collegeId, method: 'manual', studentIdUrl, note,
    });
    user.status = 'pending';
    await user.save();
    return v;
}

export async function reviewVerification(reviewer, verificationId, decision, reason) {
    if (!['verified', 'rejected'].includes(decision)) throw ApiError.badRequest('Invalid decision');
    const v = await Verification.findById(verificationId);
    if (!v) throw ApiError.notFound('Verification not found');
    if (v.status !== 'pending') throw ApiError.badRequest('Already reviewed');
    v.status = decision;
    v.reviewerId = reviewer._id;
    v.reviewedAt = new Date();
    v.decisionReason = reason;
    await v.save();
    const user = await User.findById(v.userId);
    if (user) {
        user.status = decision;
        await user.save();
        await notifyUser({
            user: user._id, collegeId: user.collegeId, type: `verification.${decision}`,
            text: decision === 'verified' ? 'Your college affiliation was verified 🎉' : 'Verification was rejected',
            link: '/app/profile',
        });
    }
    await ModerationLog.create({
        actor: reviewer._id, action: `verification.${decision}`,
        targetType: 'Verification', targetId: v._id, collegeId: v.collegeId,
        metadata: { reason },
    });
    return v;
}

export async function revokeUserVerification(userId, actor) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound();
    user.status = 'unverified';
    user.collegeId = null;
    await user.save();
    await ModerationLog.create({
        actor: actor._id, action: 'verification.revoked',
        targetType: 'User', targetId: userId,
    });
}