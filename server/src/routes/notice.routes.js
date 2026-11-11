import { Router } from 'express';
import * as c from '../controllers/notice.controller.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const r = Router();
r.get('/', c.list);
r.post('/', writeLimiter, c.create);
r.delete('/:id', c.remove);
export default r;