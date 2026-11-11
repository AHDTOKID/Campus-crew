import { Badge } from '../ui/Loader';

export function ProductCard({ item, onStatus, isOwner }) {
    return (
        <div className="card overflow-hidden flex flex-col">
            {item.images?.[0]
                ? <img src={item.images[0]} alt="" className="h-44 w-full object-cover" />
                : <div className="flex h-44 items-center justify-center bg-slate-100 text-slate-400">No image</div>}
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold leading-tight">{item.title}</h3>
                    <span className="whitespace-nowrap font-extrabold text-brand-600">₹{item.price}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge>{item.category}</Badge>
                    <Badge>{item.condition}</Badge>
                    <Badge tone={item.status === 'available' ? 'green' : 'slate'}>{item.status}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">by {item.seller?.name}</p>
                {isOwner && item.status === 'available' && (
                    <button onClick={() => onStatus?.(item._id, 'sold')} className="mt-3 rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700">Mark as sold</button>
                )}
            </div>
        </div>
    );
}