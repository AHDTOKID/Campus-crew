import User from '../models/User.js';
import ServiceListing from '../models/ServiceListing.js';
import MarketplaceItem from '../models/MarketplaceItem.js';
import Post from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const directory = asyncHandler(async (req, res) => {
    const filter = { collegeId: req.collegeId, status: 'verified' };
    if (req.query.q) filter.name = new RegExp(req.query.q, 'i');
    const users = await User.find(filter).select('name avatarUrl department year bio skills rating role').sort('name').limit(200);
    res.json(users);
});

export const profile = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!user) throw ApiError.notFound('Student not in your college');
    const [services, listings, posts] = await Promise.all([
        ServiceListing.find({ provider: user._id, active: true }).limit(20),
        MarketplaceItem.find({ seller: user._id, status: 'available' }).limit(20),
        Post.find({ author: user._id, collegeId: req.collegeId }).sort('-createdAt').limit(10),
    ]);
    res.json({ user: user.toPublicDTO(), services, listings, posts });
});