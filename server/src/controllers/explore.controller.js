import College from '../models/College.js';
import Post from '../models/Post.js';
import CollegeReview from '../models/CollegeReview.js';
import FresherGuide from '../models/FresherGuide.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

/** Public directory — returns only whitelisted fields. */
export const directory = asyncHandler(async (req, res) => {
    const filter = { isPublished: true };
    if (req.query.q) filter.name = new RegExp(req.query.q, 'i');
    const colleges = await College.find(filter).sort('name').limit(100);
    const enriched = await Promise.all(colleges.map(async (c) => {
        const [postCount, reviews] = await Promise.all([
            Post.countDocuments({ collegeId: c._id, publicationState: 'approved' }),
            CollegeReview.find({ collegeId: c._id, status: 'approved' }),
        ]);
        return {
            _id: c._id, name: c.name, slug: c.slug, city: c.city, state: c.state,
            logoUrl: c.logoUrl, description: c.description,
            postCount, reviewCount: reviews.length, averageRating: avgRating(reviews),
        };
    }));
    res.json(enriched);
});

/** Public college page — SRS FR-E02/E07: only approved public data. */
export const collegeBySlug = asyncHandler(async (req, res) => {
    const college = await College.findOne({ slug: req.params.slug, isPublished: true });
    if (!college) throw ApiError.notFound();
    const [posts, reviews, guides, studentCount] = await Promise.all([
        Post.find({ collegeId: college._id, publicationState: 'approved' })
            .populate('author', 'name avatarUrl department year').sort('-createdAt').limit(30),
        CollegeReview.find({ collegeId: college._id, status: 'approved' })
            .populate('author', 'name department year avatarUrl').sort('-createdAt'),
        FresherGuide.find({ collegeId: college._id, status: 'approved' })
            .populate('author', 'name department year').sort('-createdAt'),
        User.countDocuments({ collegeId: college._id, status: 'verified' }),
    ]);

    res.json({
        college: {
            _id: college._id, name: college.name, slug: college.slug,
            city: college.city, state: college.state, description: college.description,
            logoUrl: college.logoUrl, coverUrl: college.coverUrl,
        },
        posts: posts.map((p) => ({
            _id: p._id, text: p.text, media: p.media,
            author: { name: p.author?.name, department: p.author?.department, avatarUrl: p.author?.avatarUrl },
            createdAt: p.createdAt,
        })),
        reviews: reviews.map((r) => ({
            _id: r._id, title: r.title, text: r.text, ratings: r.ratings,
            author: { name: r.author?.name, department: r.author?.department, avatarUrl: r.author?.avatarUrl },
            createdAt: r.createdAt,
        })),
        guides: guides.map((g) => ({
            _id: g._id, title: g.title, text: g.text,
            author: { name: g.author?.name, department: g.author?.department }, createdAt: g.createdAt,
        })),
        averageRating: avgRating(reviews),
        studentCount,
    });
});

export const submitReview = asyncHandler(async (req, res) => {
    const college = await College.findOne({ slug: req.params.slug, isPublished: true });
    if (!college) throw ApiError.notFound();
    if (String(req.user.collegeId) !== String(college._id)) throw ApiError.forbidden('You can only review your own college');
    const review = await CollegeReview.create({
        collegeId: college._id, author: req.user._id,
        title: req.body.title, text: req.body.text, ratings: req.body.ratings,
    });
    res.status(201).json({ message: 'Submitted for moderation', review });
});

export const submitGuide = asyncHandler(async (req, res) => {
    const college = await College.findOne({ slug: req.params.slug, isPublished: true });
    if (!college) throw ApiError.notFound();
    if (String(req.user.collegeId) !== String(college._id)) throw ApiError.forbidden();
    const guide = await FresherGuide.create({ collegeId: college._id, author: req.user._id, title: req.body.title, text: req.body.text });
    res.status(201).json({ message: 'Submitted for moderation', guide });
});

function avgRating(reviews) {
    const keys = ['academics', 'faculty', 'facilities', 'hostel', 'food', 'placements'];
    const all = [];
    for (const r of reviews) for (const k of keys) if (r.ratings?.[k]) all.push(r.ratings[k]);
    return all.length ? Math.round((all.reduce((a, b) => a + b, 0) / all.length) * 10) / 10 : 0;
}