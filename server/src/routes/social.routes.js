import { Router } from 'express';
import * as c from '../controllers/social.controller.js';
import { validate } from '../middleware/validate.js';
import { createPostSchema } from '../validators/social.schema.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const r = Router();
r.get('/', c.feed);
r.post('/', writeLimiter, validate(createPostSchema), c.createPost);
r.delete('/:id', c.deletePost);
r.post('/:id/like', c.likePost);
r.get('/:id/comments', c.listComments);
export default r;