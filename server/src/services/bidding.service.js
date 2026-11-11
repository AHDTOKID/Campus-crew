import Proposal from '../models/Proposal.js';
import ServiceRequest from '../models/ServiceRequest.js';
import { ApiError } from '../utils/ApiError.js';
import { notifyUser } from './notification.service.js';

/** Proposal state machine (FR-S04). */
const TRANSITIONS = {
    accept: { from: ['pending'], to: 'accepted' },
    reject: { from: ['pending'], to: 'rejected' },
    withdraw: { from: ['pending'], to: 'withdrawn' },
};

export async function submitProposal({ collegeId, requestId, provider, data }) {
    const request = await ServiceRequest.findOne({ _id: requestId, collegeId });
    if (!request) throw ApiError.notFound('Request not found');
    if (request.status !== 'open') throw ApiError.badRequest('Request is not open');
    if (String(request.author) === String(provider._id)) throw ApiError.badRequest('Cannot propose on your own request');
    if (await Proposal.exists({ request: requestId, provider: provider._id })) {
        throw ApiError.conflict('Proposal already submitted');
    }
    const proposal = await Proposal.create({ collegeId, request: requestId, provider: provider._id, ...data });
    request.proposalCount += 1;
    await request.save();
    await notifyUser({
        user: request.author, collegeId, type: 'proposal.created',
        text: `New proposal (₹${data.price}) on "${request.title}"`,
        link: `/app/services/requests/${requestId}`,
    });
    return proposal;
}

export async function acceptProposal({ collegeId, proposalId, actor }) {
    const proposal = await Proposal.findOne({ _id: proposalId, collegeId }).populate('request');
    if (!proposal) throw ApiError.notFound();
    if (String(proposal.request.author) !== String(actor._id)) throw ApiError.forbidden('Only the request owner can accept');
    if (!TRANSITIONS.accept.from.includes(proposal.status)) throw ApiError.badRequest('Proposal is not pending');

    proposal.status = 'accepted';
    await proposal.save();
    await Proposal.updateMany(
        { request: proposal.request._id, _id: { $ne: proposal._id }, status: 'pending' },
        { status: 'rejected' }
    );
    await ServiceRequest.updateOne(
        { _id: proposal.request._id },
        { status: 'assigned', assignedTo: proposal.provider }
    );
    await notifyUser({
        user: proposal.provider, collegeId, type: 'proposal.accepted',
        text: `Your proposal for "${proposal.request.title}" was accepted`,
        link: `/app/services/requests/${proposal.request._id}`,
    });
    return proposal;
}

export async function transitionProposal({ collegeId, proposalId, actor, action }) {
    const t = TRANSITIONS[action];
    if (!t) throw ApiError.badRequest('Unknown action');
    const proposal = await Proposal.findOne({ _id: proposalId, collegeId });
    if (!proposal) throw ApiError.notFound();
    if (action === 'withdraw' && String(proposal.provider) !== String(actor._id)) throw ApiError.forbidden();
    if (!t.from.includes(proposal.status)) throw ApiError.badRequest(`Cannot ${action} proposal in status ${proposal.status}`);
    proposal.status = t.to;
    await proposal.save();
    return proposal;
}