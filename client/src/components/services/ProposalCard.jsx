import { Badge } from '../ui/Loader';
import { Button } from '../ui/Button';

export function ProposalCard({ proposal, canAccept, onAccept }) {
    return (
        <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{proposal.provider?.name} · ₹{proposal.price}</p>
                <Badge tone={proposal.status === 'accepted' ? 'green' : proposal.status === 'rejected' ? 'rose' : 'amber'}>{proposal.status}</Badge>
            </div>
            {proposal.message && <p className="mt-1 text-sm text-slate-600">{proposal.message}</p>}
            {canAccept && proposal.status === 'pending' && <Button className="mt-2" onClick={() => onAccept(proposal._id)}>Accept</Button>}
        </div>
    );
}