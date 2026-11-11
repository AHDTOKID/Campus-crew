import Notice from '../models/Notice.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const list = asyncHandler(async (req, res) => {
    const filter = { collegeId: req.collegeId, status: 'visible' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) filter.title = new RegExp(req.query.q, 'i');
    const items = await Notice.find(filter).populate('author', 'name avatarUrl role').sort('-createdAt').limit(200);
    res.json(items);
});

export const create = asyncHandler(async (req, res) => {
    const canOfficial = ['moderator', 'admin'].includes(req.user.role);
    const sourceLabel = canOfficial && req.body.sourceLabel === 'official' ? 'official' : 'student';
    const doc = await Notice.create({ collegeId: req.collegeId, author: req.user._id, ...req.body, sourceLabel });
    await doc.populate('author', 'name avatarUrl');
    res.status(201).json(doc);
});

export const remove = asyncHandler(async (req, res) => {
    const doc = await Notice.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!doc) throw ApiError.notFound();
    const owner = String(doc.author) === String(req.user._id);
    if (!owner && !['moderator', 'admin'].includes(req.user.role)) throw ApiError.forbidden();
    await doc.deleteOne();
    res.json({ message: 'Deleted' });
});