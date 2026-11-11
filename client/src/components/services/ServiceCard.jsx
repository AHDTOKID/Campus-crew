import { Badge } from '../ui/Loader';

export function ServiceCard({ listing }) {
    return (
        <div className="card p-5">
            <div className="flex items-center justify-between">
                <h3 className="font-bold">{listing.title}</h3>
                <span className="font-bold text-brand-600">₹{listing.price}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{listing.description}</p>
            <p className="mt-3 text-xs text-slate-500">by {listing.provider?.name} · <Badge>{listing.category}</Badge></p>
        </div>
    );
}