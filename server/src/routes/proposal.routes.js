import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import Proposal from '../models/Proposal.js';
import { submitProposal, acceptProposal, transitionProposal } from '../services/bidding.service.js';
import { validate } from '../middleware/validate.js';
import { createProposalSchema } from '../validators/service.schema.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const r = Router();

r.get('/request/:requestId', asyncHandler(async (req, res) => {
    const proposals = await Proposal.find({ request: req.params.requestId, collegeId: req.collegeId })
        .populate('provider', 'name avatarUrl department year rating').sort('-createdAt');
    res.json(proposals);
}));

r.post('/request/:requestId', writeLimiter, validate(createProposalSchema), asyncHandler(async (req, res) => {
    const p = await submitProposal({ collegeId: req.collegeId, requestId: req.params.requestId, provider: req.user, data: req.body });
    await p.populate('provider', 'name avatarUrl');
    res.status(201).json(p);
}));

r.patch('/:id/accept', asyncHandler(async (req, res) => {
    res.json(await acceptProposal({ collegeId: req.collegeId, proposalId: req.params.id, actor: req.user }));
}));

r.patch('/:id/:action(reject|withdraw)', asyncHandler(async (req, res) => {
    res.json(await transitionProposal({ collegeId: req.collegeId, proposalId: req.params.id, actor: req.user, action: req.params.action }));
}));

export default r;