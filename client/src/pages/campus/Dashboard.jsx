import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { Loader, Badge } from '../../components/ui/Loader';

export default function Dashboard() {
    const { user, college } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (user?.role === 'admin' || user?.status !== 'verified') {
            setData({ requests: [], market: [], posts: [], notices: [] });
            return;
        }
        Promise.all([
            api.get('/services/requests?status=open').catch(() => ({ items: [] })),
            api.get('/market').catch(() => ({ items: [] })),
            api.get('/social').catch(() => ({ items: [] })),
            api.get('/notices').catch(() => []),
        ]).then(([r, m, p, n]) => setData({ requests: r.items || [], market: m.items || [], posts: p.items || [], notices: n || [] }));
    }, [user?.role, user?.status]);

    if (!data) return <Loader />;

    if (user?.role === 'admin') {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold">Admin Dashboard 👋</h1>
                    <p className="text-slate-500">Platform Administrator</p>
                </div>
                <div className="card p-5">
                    <p className="font-semibold">Welcome to the Administration Console.</p>
                    <p className="mt-1 text-sm text-slate-600">Manage student verifications, review reports, and college directories.</p>
                    <Link to="/app/admin" className="mt-3 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Open Admin Console</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold">Hi {user?.name ? user.name.split(' ')[0] : 'there'} 👋</h1>
                <p className="text-slate-500">{college?.name || 'Campus Crew'}</p>
            </div>

            {user.status !== 'verified' && (
                <div className="card border-amber-200 bg-amber-50 p-5">
                    <p className="font-semibold text-amber-900">Your affiliation is {user.status}.</p>
                    <p className="mt-1 text-sm text-amber-800">Private features unlock once verified.</p>
                    <Link to="/app/profile" className="mt-3 inline-block rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Submit verification</Link>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[['Open requests', data.requests.length], ['Listings', data.market.length], ['Campus posts', data.posts.length], ['Notices', data.notices.length]].map(([l, v]) => (
                    <div key={l} className="card p-5"><p className="text-3xl font-extrabold text-brand-600">{v}</p><p className="mt-1 text-sm text-slate-500">{l}</p></div>
                ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="card p-5">
                    <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Latest notices</h2><Link to="/app/notices" className="text-sm font-semibold text-brand-600">View all</Link></div>
                    <ul className="space-y-3">
                        {data.notices.slice(0, 4).map((n) => (
                            <li key={n._id} className="flex items-start gap-3">
                                <Badge tone={n.sourceLabel === 'official' ? 'brand' : 'slate'}>{n.sourceLabel}</Badge>
                                <div><p className="text-sm font-semibold">{n.title}</p><p className="text-xs text-slate-500">{n.category}</p></div>
                            </li>
                        ))}
                        {!data.notices.length && <p className="text-sm text-slate-500">No notices yet.</p>}
                    </ul>
                </div>
                <div className="card p-5">
                    <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Open requests</h2><Link to="/app/services" className="text-sm font-semibold text-brand-600">View all</Link></div>
                    <ul className="space-y-3">
                        {data.requests.slice(0, 4).map((r) => (
                            <li key={r._id}><p className="text-sm font-semibold">{r.title}</p><p className="text-xs text-slate-500">{r.category} · {r.proposalCount} proposals</p></li>
                        ))}
                        {!data.requests.length && <p className="text-sm text-slate-500">No open requests.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
}