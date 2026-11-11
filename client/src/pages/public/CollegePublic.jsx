import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { Avatar } from '../../components/ui/Avatar';
import { Loader } from '../../components/ui/Loader';
import { useAuth } from '../../hooks/useAuth';

export default function CollegePublic({ insideApp = false }) {
    const { user } = useAuth();
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [tab, setTab] = useState('gallery');

    useEffect(() => { api.get(`/explore/colleges/${slug}`).then(setData); }, [slug]);
    if (!data) return <Loader />;

    const backUrl = insideApp ? '/app/explore' : '/explore';

    const content = (
        <div className="space-y-6">
            <Link to={backUrl} className="inline-block text-sm font-semibold text-brand-600 hover:underline">← All colleges</Link>
            <div>
                <h1 className="text-3xl font-extrabold">{data.college.name}</h1>
                <p className="text-slate-500">{[data.college.city, data.college.state].filter(Boolean).join(', ')}</p>
                <p className="mt-3 max-w-3xl text-slate-700">{data.college.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                    <span className="rounded-xl bg-white px-3 py-1.5 shadow-sm">⭐ {data.averageRating || '—'}</span>
                    <span className="rounded-xl bg-white px-3 py-1.5 shadow-sm">🎓 {data.studentCount} verified</span>
                    <span className="rounded-xl bg-white px-3 py-1.5 shadow-sm">📝 {data.reviews.length} reviews</span>
                </div>
            </div>
            <div className="flex gap-2">
                {[['gallery', 'Campus Life'], ['reviews', 'Reviews'], ['guides', 'Fresher Guides']].map(([k, l]) => (
                    <button key={k} onClick={() => setTab(k)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === k ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>{l}</button>
                ))}
            </div>
            <div className="mt-5">
                {tab === 'gallery' && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {data.posts.map((p) => (
                            <div key={p._id} className="card overflow-hidden">
                                {p.media?.[0] && <img src={p.media[0]} alt="" className="h-48 w-full object-cover" />}
                                <div className="p-4"><p className="text-sm">{p.text}</p><p className="mt-2 text-xs text-slate-500">by {p.author?.name}</p></div>
                            </div>
                        ))}
                        {!data.posts.length && <p className="text-slate-500">No public photos yet.</p>}
                    </div>
                )}
                {tab === 'reviews' && (
                    <div className="space-y-4">
                        {data.reviews.map((r) => (
                            <div key={r._id} className="card p-5">
                                <div className="flex items-center gap-3">
                                    <Avatar name={r.author?.name} src={r.author?.avatarUrl} />
                                    <div><p className="text-sm font-semibold">{r.author?.name}</p><p className="text-xs text-slate-500">{r.author?.department}</p></div>
                                </div>
                                {r.title && <p className="mt-3 font-bold">{r.title}</p>}
                                <p className="mt-1 text-sm text-slate-700">{r.text}</p>
                            </div>
                        ))}
                        {!data.reviews.length && <p className="text-slate-500">No reviews published yet.</p>}
                    </div>
                )}
                {tab === 'guides' && (
                    <div className="space-y-4">
                        {data.guides.map((g) => (
                            <div key={g._id} className="card p-5">
                                <p className="font-bold">{g.title}</p>
                                <p className="mt-1 text-sm text-slate-700">{g.text}</p>
                                <p className="mt-2 text-xs text-slate-500">by {g.author?.name}</p>
                            </div>
                        ))}
                        {!data.guides.length && <p className="text-slate-500">No fresher guides yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );

    if (insideApp) return content;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link to="/explore" className="text-sm font-semibold text-brand-600">← All colleges</Link>
                    {user ? (
                        <Link to="/app/dashboard" className="text-sm font-semibold text-brand-600">Go to App →</Link>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-slate-600">Log in</Link>
                    )}
                </div>
            </header>
            <div className="mx-auto max-w-5xl px-6 py-10">
                {content}
            </div>
        </div>
    );
}