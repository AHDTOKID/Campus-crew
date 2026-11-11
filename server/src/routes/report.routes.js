import { Router } from 'express';
import { fileReport } from '../services/moderation.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const r = Router();
r.post('/', asyncHandler(async (req, res) => {
    const { targetType, targetId, reason } = req.body;
    if (!targetType || !targetId || !reason) throw ApiError.badRequest('Missing fields');
    const collegeId = req.user.collegeId || null;
    const report = await fileReport({ reporter: req.user, collegeId, targetType, targetId, reason });
    res.status(201).json({ message: 'Report submitted', report });
}));
export default r;