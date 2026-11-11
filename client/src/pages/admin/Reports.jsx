import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';

export function Reports() {
    const [items, setItems] = useState(null);
    const load = () => api.get('/admin/reports').then(setItems);
    useEffect(() => { load(); }, []);
    const decide = async (id, decision) => { await api.patch(`/admin/reports/${id}`, { decision }); load(); };
    if (!items) return <Loader />;
    return (
        <div className="space-y-3">
            {items.map((r) => (
                <div key={r._id} className="card p-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold">{r.targetType} reported by {r.reporter?.name}</p>
                        <p className="text-xs text-slate-500">Reason: {r.reason}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="danger" onClick={() => decide(r._id, 'remove')}>Remove</Button>
                        <Button variant="outline" onClick={() => decide(r._id, 'dismiss')}>Dismiss</Button>
                    </div>
                </div>
            ))}
            {!items.length && <p className="text-slate-500">No reports.</p>}
        </div>
    );
}