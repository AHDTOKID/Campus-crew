import { Router } from 'express';
import * as c from '../controllers/service.controller.js';
import { validate } from '../middleware/validate.js';
import { createRequestSchema, createListingSchema } from '../validators/service.schema.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const r = Router();
r.get('/requests', c.listRequests);
r.post('/requests', writeLimiter, validate(createRequestSchema), c.createRequest);
r.get('/requests/:id', c.requestDetail);
r.patch('/requests/:id/complete', c.completeRequest);
r.get('/listings', c.listListings);
r.post('/listings', writeLimiter, validate(createListingSchema), c.createListing);
r.delete('/listings/:id', c.removeListing);
export default r;