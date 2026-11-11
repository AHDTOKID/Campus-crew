import { Router } from 'express';
import * as c from '../controllers/market.controller.js';
import { validate } from '../middleware/validate.js';
import { createItemSchema, updateItemSchema } from '../validators/marketplace.schema.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const r = Router();
r.get('/', c.list);
r.post('/', writeLimiter, validate(createItemSchema), c.create);
r.patch('/:id', validate(updateItemSchema), c.update);
r.delete('/:id', c.remove);
r.post('/:id/bookmark', c.bookmark);
export default r;