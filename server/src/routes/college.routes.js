import { Router } from 'express';
import * as c from '../controllers/college.controller.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/', c.list);
r.get('/:slug', c.detailBySlug);
r.post('/request', protect, c.requestCollege);
export default r;