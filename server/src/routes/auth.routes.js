import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const r = Router();
r.post('/register', authLimiter, validate(registerSchema), c.register);
r.post('/login', authLimiter, validate(loginSchema), c.login);
r.get('/me', protect, c.me);
r.patch('/me', protect, c.updateMe);
r.post('/me/password', protect, c.changePassword);
export default r;