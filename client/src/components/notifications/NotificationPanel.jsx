import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Loader } from '../ui/Loader';

export function NotificationPanel() {
    const [items, setItems] = useState(null);

    useEffect(() => {
        api.get('/notifications').then((d) => setItems(d.notifications));
    }, []);

    if (!items) return <Loader />;
    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-extrabold">Notifications</h1>
            {items.map((n) => (
                <div key={n._id} className={`card p-4 ${n.read ? 'opacity-60' : ''}`}>
                    <p className="text-sm">{n.text}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
            ))}
            {!items.length && <p className="text-slate-500">You're all caught up.</p>}
        </div>
    );
}