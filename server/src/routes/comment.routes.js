import { Router } from 'express';
import * as c from '../controllers/social.controller.js';
import { validate } from '../middleware/validate.js';
import { commentSchema } from '../validators/social.schema.js';
import Comment from '../models/Comment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const r = Router();
r.post('/post/:id', validate(commentSchema), c.createComment);
r.delete('/:id', asyncHandler(async (req, res) => {
    const comment = await Comment.findOne({ _id: req.params.id, collegeId: req.collegeId });
    if (!comment) throw ApiError.notFound();
    const owner = String(comment.author) === String(req.user._id);
    if (!owner && !['moderator', 'admin'].includes(req.user.role)) throw ApiError.forbidden();
    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();
    res.json({ message: 'Deleted' });
}));
export default r;