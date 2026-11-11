import College from '../models/College.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (_req, res) => {
    const colleges = await College.find({ isPublished: true }).select('name slug city state logoUrl').sort('name');
    res.json(colleges);
});

export const detailBySlug = asyncHandler(async (req, res) => {
    const college = await College.findOne({ slug: req.params.slug, isPublished: true });
    if (!college) throw ApiError.notFound();
    res.json(college);
});

export const requestCollege = asyncHandler(async (req, res) => {
    const { name, city, state } = req.body;
    if (!name) throw ApiError.badRequest('Name required');
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (await College.exists({ slug })) throw ApiError.conflict('College already listed');
    const college = await College.create({ name, slug, city, state, isPublished: false, requestedBy: req.user._id });
    res.status(201).json({ message: 'Requested for review', college });
});