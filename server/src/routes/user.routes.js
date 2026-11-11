import { Router } from 'express';
import * as c from '../controllers/user.controller.js';
const r = Router();
r.get('/', c.directory);
r.get('/:id', c.profile);
export default r;