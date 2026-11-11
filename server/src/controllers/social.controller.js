import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { pagination } from '../utils/pagination.js';
import { notifyUser } from '../services/notification.service.js';

export const feed = asyncHandler(async (req, res) => {
    const { skip, limit, meta } = pagination(req);
    const filter = { collegeId: req.collegeId };
    const [items, total] = await Promise.all([
        Post.find(filter).populate('author', 'name avatarUrl department year').sort('-createdAt').skip(skip).limit(limit),
        Post.countDocuments(filter),
    ]);
    res.json({ items, pagination: meta(total) });
});

export const createPost = asyncHandler(async (req, res) => {
    const { text, media, nominatePublic } = req.body;
    const doc = await Post.create({
        collegeId: req.collegeId, author: req.user._id, text, media,
        visibility: nominatePublic ? 'public-nominated' : 'private',
        publicationState: nominatePublic ? 'pending' : 'private',
    });
    await doc.populate('author', 'name avatarUrl department year');
    res.status(201).json(doc);
});

export const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!post) throw ApiError.notFound();
    const owner = String(post.author) === String(req.user._id);
    if (!owner && !['moderator', 'admin'].includes(req.user.role)) throw ApiError.forbidden();
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: 'Deleted' });
});

export const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!post) throw ApiError.notFound();
    const i = post.likes.findIndex((u) => String(u) === String(req.user._id));
    if (i >= 0) post.likes.splice(i, 1); else post.likes.push(req.user._id);
    await post.save();
    res.json({ liked: i < 0, likes: post.likes.length });
});

export const listComments = asyncHandler(async (req, res) => {
    const list = await Comment.find({ post: req.params.id, collegeId: req.collegeId })
        .populate('author', 'name avatarUrl department year').sort('createdAt');
    res.json(list);
});

export const createComment = asyncHandler(async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!post) throw ApiError.notFound();
    const { text, parentCommentId } = req.body;
    let parent = null;
    if (parentCommentId) {
        parent = await Comment.findOne({ _id: parentCommentId, post: post._id, collegeId: req.collegeId });
        if (!parent) throw ApiError.badRequest('Parent comment not found');
    }
    const comment = await Comment.create({
        collegeId: req.collegeId, post: post._id, author: req.user._id,
        text, parentComment: parent?._id || null,
    });
    post.commentCount += 1;
    await post.save();
    await comment.populate('author', 'name avatarUrl department year');
    const target = parent ? parent.author : post.author;
    if (String(target) !== String(req.user._id)) {
        await notifyUser({
            user: target, collegeId: req.collegeId,
            type: parent ? 'comment.reply' : 'post.comment',
            text: `${req.user.name} ${parent ? 'replied' : 'commented'}`, link: '/app/feed',
        });
    }
    res.status(201).json(comment);
});