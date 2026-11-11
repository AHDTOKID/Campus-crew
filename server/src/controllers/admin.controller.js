import College from '../models/College.js';
import Verification from '../models/Verification.js';
import Report from '../models/Report.js';
import Post from '../models/Post.js';
import CollegeReview from '../models/CollegeReview.js';
import FresherGuide from '../models/FresherGuide.js';
import ModerationLog from '../models/ModerationLog.js';
import { reviewVerification } from '../services/verification.service.js';
import { resolveReport } from '../services/moderation.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const listVerifications = asyncHandler(async (_req, res) => {
    const items = await Verification.find({ status: 'pending' })
        .populate('userId', 'name email department year')
        .populate('collegeId', 'name slug').sort('createdAt');
    res.json(items);
});

export const decideVerification = asyncHandler(async (req, res) => {
    const v = await reviewVerification(req.user, req.params.id, req.body.decision, req.body.reason);
    res.json(v);
});

export const listReports = asyncHandler(async (_req, res) => {
    const items = await Report.find({ status: 'open' }).populate('reporter', 'name').sort('-createdAt');
    res.json(items);
});

export const decideReport = asyncHandler(async (req, res) => {
    const r = await resolveReport({ actor: req.user, reportId: req.params.id, decision: req.body.decision, reason: req.body.reason });
    res.json(r);
});

export const pendingPublicContent = asyncHandler(async (_req, res) => {
    const [posts, reviews, guides] = await Promise.all([
        Post.find({ publicationState: 'pending' }).populate('author', 'name').populate('collegeId', 'name'),
        CollegeReview.find({ status: 'pending' }).populate('author', 'name').populate('collegeId', 'name'),
        FresherGuide.find({ status: 'pending' }).populate('author', 'name').populate('collegeId', 'name'),
    ]);
    res.json({ posts, reviews, guides });
});

export const approvePublic = asyncHandler(async (req, res) => {
    const { kind, id } = req.params;
    const approve = req.body.approve !== false;
    const map = {
        post: [Post, { publicationState: approve ? 'approved' : 'rejected' }],
        review: [CollegeReview, { status: approve ? 'approved' : 'rejected' }],
        guide: [FresherGuide, { status: approve ? 'approved' : 'rejected' }],
    };
    const entry = map[kind];
    if (!entry) throw ApiError.badRequest('Unknown kind');
    await entry[0].findByIdAndUpdate(id, entry[1]);
    await ModerationLog.create({ actor: req.user._id, action: `public.${approve ? 'approve' : 'reject'}`, targetType: kind, targetId: id });
    res.json({ message: approve ? 'Approved' : 'Rejected' });
});

export const createCollege = asyncHandler(async (req, res) => {
    const { name, city, state, description } = req.body;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const college = await College.create({ name, slug, city, state, description, isPublished: true });
    res.status(201).json(college);
});

export const auditLog = asyncHandler(async (_req, res) => {
    const logs = await ModerationLog.find().populate('actor', 'name').sort('-createdAt').limit(100);
    res.json(logs);
});