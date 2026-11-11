import { Router } from 'express';
import * as c from '../controllers/explore.controller.js';
import { protect } from '../middleware/auth.js';
import { requireVerifiedCollege } from '../middleware/collegeAccess.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const r = Router();
r.get('/colleges', c.directory);
r.get('/colleges/:slug', c.collegeBySlug);
r.post('/colleges/:slug/reviews', protect, requireVerifiedCollege, writeLimiter, c.submitReview);
r.post('/colleges/:slug/guides', protect, requireVerifiedCollege, writeLimiter, c.submitGuide);
export default r;