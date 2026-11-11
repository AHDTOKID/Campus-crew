import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { verificationSchema } from '../validators/auth.schema.js';

const r = Router();
r.post('/', validate(verificationSchema), c.submitMyVerification);
export default r;