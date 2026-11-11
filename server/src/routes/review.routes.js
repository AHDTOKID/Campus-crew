import { Router } from 'express';
import * as c from '../controllers/explore.controller.js';

const r = Router();
r.post('/college/:slug', c.submitReview);
r.post('/guide/:slug', c.submitGuide);
export default r;