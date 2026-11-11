import { Router } from 'express';
import * as c from '../controllers/admin.controller.js';

const r = Router();
r.get('/verifications', c.listVerifications);
r.patch('/verifications/:id', c.decideVerification);
r.get('/reports', c.listReports);
r.patch('/reports/:id', c.decideReport);
r.get('/public/pending', c.pendingPublicContent);
r.patch('/public/:kind/:id', c.approvePublic);
r.post('/colleges', c.createCollege);
r.get('/audit', c.auditLog);
export default r;