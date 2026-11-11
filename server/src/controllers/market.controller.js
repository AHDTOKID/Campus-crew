import MarketplaceItem from '../models/MarketplaceItem.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { pagination } from '../utils/pagination.js';

export const list = asyncHandler(async (req, res) => {
    const { skip, limit, meta } = pagination(req);
    const filter = { collegeId: req.collegeId, status: { $ne: 'removed' } };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.condition) filter.condition = req.query.condition;
    if (req.query.q) filter.$or = [{ title: new RegExp(req.query.q, 'i') }, { description: new RegExp(req.query.q, 'i') }];
    if (req.query.min || req.query.max) {
        filter.price = {};
        if (req.query.min) filter.price.$gte = Number(req.query.min);
        if (req.query.max) filter.price.$lte = Number(req.query.max);
    }
    const [items, total] = await Promise.all([
        MarketplaceItem.find(filter).populate('seller', 'name avatarUrl department year').sort('-createdAt').skip(skip).limit(limit),
        MarketplaceItem.countDocuments(filter),
    ]);
    res.json({ items, pagination: meta(total) });
});

export const create = asyncHandler(async (req, res) => {
    const doc = await MarketplaceItem.create({ collegeId: req.collegeId, seller: req.user._id, ...req.body });
    await doc.populate('seller', 'name avatarUrl');
    res.status(201).json(doc);
});

export const update = asyncHandler(async (req, res) => {
    const doc = await MarketplaceItem.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!doc) throw ApiError.notFound();
    if (String(doc.seller) !== String(req.user._id)) throw ApiError.forbidden();
    Object.assign(doc, req.body);
    await doc.save();
    res.json(doc);
});

export const remove = asyncHandler(async (req, res) => {
    const doc = await MarketplaceItem.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!doc) throw ApiError.notFound();
    if (String(doc.seller) !== String(req.user._id)) throw ApiError.forbidden();
    doc.status = 'removed';
    await doc.save();
    res.json({ message: 'Removed' });
});

export const bookmark = asyncHandler(async (req, res) => {
    const doc = await MarketplaceItem.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!doc) throw ApiError.notFound();
    const i = doc.savedBy.findIndex((u) => String(u) === String(req.user._id));
    if (i >= 0) doc.savedBy.splice(i, 1); else doc.savedBy.push(req.user._id);
    await doc.save();
    res.json({ saved: i < 0 });
});