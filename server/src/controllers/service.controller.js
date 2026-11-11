import ServiceRequest from '../models/ServiceRequest.js';
import ServiceListing from '../models/ServiceListing.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { pagination } from '../utils/pagination.js';

export const listRequests = asyncHandler(async (req, res) => {
    const { skip, limit, meta } = pagination(req);
    const filter = { collegeId: req.collegeId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) filter.$or = [{ title: new RegExp(req.query.q, 'i') }, { description: new RegExp(req.query.q, 'i') }];
    const [items, total] = await Promise.all([
        ServiceRequest.find(filter).populate('author', 'name avatarUrl department year').sort('-createdAt').skip(skip).limit(limit),
        ServiceRequest.countDocuments(filter),
    ]);
    res.json({ items, pagination: meta(total) });
});

export const createRequest = asyncHandler(async (req, res) => {
    const doc = await ServiceRequest.create({ collegeId: req.collegeId, author: req.user._id, ...req.body });
    await doc.populate('author', 'name avatarUrl department year');
    res.status(201).json(doc);
});

export const requestDetail = asyncHandler(async (req, res) => {
    const doc = await ServiceRequest.findOne({ _id: req.params.id, collegeId: req.collegeId })
        .populate('author', 'name avatarUrl department year')
        .populate('assignedTo', 'name avatarUrl');
    if (!doc) throw ApiError.notFound();
    res.json(doc);
});

export const completeRequest = asyncHandler(async (req, res) => {
    const doc = await ServiceRequest.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!doc) throw ApiError.notFound();
    if (String(doc.author) !== String(req.user._id)) throw ApiError.forbidden();
    if (!['assigned', 'in-progress'].includes(doc.status)) throw ApiError.badRequest('Cannot complete in this state');
    doc.status = 'completed';
    await doc.save();
    res.json(doc);
});

export const listListings = asyncHandler(async (req, res) => {
    const { skip, limit, meta } = pagination(req);
    const filter = { collegeId: req.collegeId, active: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) filter.title = new RegExp(req.query.q, 'i');
    const [items, total] = await Promise.all([
        ServiceListing.find(filter).populate('provider', 'name avatarUrl department year rating').sort('-createdAt').skip(skip).limit(limit),
        ServiceListing.countDocuments(filter),
    ]);
    res.json({ items, pagination: meta(total) });
});

export const createListing = asyncHandler(async (req, res) => {
    const doc = await ServiceListing.create({ collegeId: req.collegeId, provider: req.user._id, ...req.body });
    await doc.populate('provider', 'name avatarUrl');
    res.status(201).json(doc);
});

export const removeListing = asyncHandler(async (req, res) => {
    const doc = await ServiceListing.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!doc) throw ApiError.notFound();
    if (String(doc.provider) !== String(req.user._id)) throw ApiError.forbidden();
    doc.active = false;
    await doc.save();
    res.json({ message: 'Removed' });
});