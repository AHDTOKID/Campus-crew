import { Router } from 'express';
import { validateUploadMeta } from '../middleware/upload.js';
import { buildUploadUrl } from '../services/media.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();
r.post('/sign', validateUploadMeta, asyncHandler(async (req, res) => {
    res.json(buildUploadUrl(req.body));
}));
export default r;