import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Loader } from '../../components/ui/Loader';
import { useAuth } from '../../hooks/useAuth';

export default function Explore({ insideApp = false }) {
    const { user } = useAuth();
    const [colleges, setColleges] = useState([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/explore/colleges${q ? `?q=${encodeURIComponent(q)}` : ''}`).then(setColleges).finally(() => setLoading(false));
    }, [q]);

    const targetSlug = (slug) => insideApp ? `/app/explore/${slug}` : `/explore/${slug}`;

    const content = (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">Campus Explore</h1>
                <p className="mt-1 text-slate-600">Authentic campus life — explore universities across the platform.</p>
            </div>
            <input className="input mt-4" placeholder="Search colleges…" value={q} onChange={(e) => setQ(e.target.value)} />
            {loading ? <Loader /> : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {colleges.map((c) => (
                        <Link key={c._id} to={targetSlug(c.slug)}>
                            <div className="card h-full p-5 hover:border-brand-300 hover:shadow-md">
                                <h2 className="font-bold">{c.name}</h2>
                                <p className="text-sm text-slate-500">{[c.city, c.state].filter(Boolean).join(', ')}</p>
                                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{c.description}</p>
                                <div className="mt-3 flex gap-3 text-xs font-semibold text-slate-500">
                                    <span>⭐ {c.averageRating || '—'}</span>
                                    <span>📝 {c.reviewCount}</span>
                                    <span>📸 {c.postCount}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {!colleges.length && <p className="text-slate-500">No colleges found.</p>}
                </div>
            )}
        </div>
    );

    if (insideApp) return content;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link to="/" className="font-extrabold">Campus<span className="text-brand-600">Crew</span></Link>
                    {user ? (
                        <Link to="/app/dashboard" className="text-sm font-semibold text-brand-600">Go to App →</Link>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-brand-600">Log in</Link>
                    )}
                </div>
            </header>
            <div className="mx-auto max-w-5xl px-6 py-10">
                {content}
            </div>
        </div>
    );
}