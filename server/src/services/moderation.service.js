import ModerationLog from '../models/ModerationLog.js';
import Report from '../models/Report.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import MarketplaceItem from '../models/MarketplaceItem.js';
import CollegeReview from '../models/CollegeReview.js';
import { ApiError } from '../utils/ApiError.js';

export async function fileReport({ reporter, collegeId, targetType, targetId, reason }) {
    if (!['post', 'comment', 'listing', 'message', 'review'].includes(targetType)) {
        throw ApiError.badRequest('Unknown target type');
    }
    return Report.create({ reporter: reporter._id, collegeId, targetType, targetId, reason });
}

export async function resolveReport({ actor, reportId, decision, reason }) {
    const report = await Report.findById(reportId);
    if (!report) throw ApiError.notFound();
    if (actor.role !== 'admin' && String(report.collegeId) !== String(actor.collegeId)) {
        throw ApiError.forbidden('Not your college');
    }
    report.status = decision === 'dismiss' ? 'dismissed' : 'reviewed';
    report.decision = decision;
    await report.save();
    if (decision === 'remove') await applyRemoval(report);
    await ModerationLog.create({
        actor: actor._id, action: `report.${decision}`,
        targetType: report.targetType, targetId: report.targetId,
        collegeId: report.collegeId, metadata: { reason },
    });
    return report;
}

async function applyRemoval(report) {
    switch (report.targetType) {
        case 'post': return Post.updateOne({ _id: report.targetId }, { publicationState: 'rejected' });
        case 'comment': return Comment.deleteOne({ _id: report.targetId });
        case 'listing': return MarketplaceItem.updateOne({ _id: report.targetId }, { status: 'removed' });
        case 'review': return CollegeReview.updateOne({ _id: report.targetId }, { status: 'rejected' });
        default: return null;
    }
}