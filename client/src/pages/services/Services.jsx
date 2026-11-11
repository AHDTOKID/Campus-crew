import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Loader } from '../../components/ui/Loader';
import { ServiceCard } from '../../components/services/ServiceCard';
import { ProposalCard } from '../../components/services/ProposalCard';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { SERVICE_CATEGORIES } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';

export default function Services() {
    const { user } = useAuth();
    const [tab, setTab] = useState('requests');
    const [requests, setRequests] = useState(null);
    const [listings, setListings] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);

    const load = async () => {
        const [r, l] = await Promise.all([api.get('/services/requests'), api.get('/services/listings')]);
        setRequests(r.items); setListings(l.items);
    };
    useEffect(() => { load(); }, []);

    const openDetail = async (id) => {
        setSelected(id);
        const [d, proposals] = await Promise.all([
            api.get(`/services/requests/${id}`),
            api.get(`/proposals/request/${id}`),
        ]);
        setDetail({ request: d, proposals });
    };

    const createRequest = async (e) => {
        e.preventDefault();
        const f = e.target;
        await api.post('/services/requests', {
            title: f.title.value, description: f.description.value, category: f.category.value,
            budgetMin: f.budgetMin.value ? Number(f.budgetMin.value) : undefined,
            budgetMax: f.budgetMax.value ? Number(f.budgetMax.value) : undefined,
        });
        f.reset(); setShowForm(false); load();
    };

    const createListing = async (e) => {
        e.preventDefault();
        const f = e.target;
        await api.post('/services/listings', {
            title: f.title.value, description: f.description.value,
            category: f.category.value, price: Number(f.price.value),
        });
        f.reset(); setShowForm(false); load();
    };

    const propose = async (e) => {
        e.preventDefault();
        const f = e.target;
        await api.post(`/proposals/request/${selected}`, {
            price: Number(f.price.value), deliveryDays: Number(f.days.value || 0), message: f.message.value,
        });
        openDetail(selected);
    };

    const accept = async (pid) => { await api.patch(`/proposals/${pid}/accept`); openDetail(selected); load(); };

    if (!requests) return <Loader />;
    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-extrabold">Freelance & Services</h1>
                <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Close' : 'Create'}</Button>
            </div>
            <div className="flex gap-2">
                {['requests', 'listings'].map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>
                        {t === 'requests' ? 'Work Requests' : 'Service Listings'}
                    </button>
                ))}
            </div>

            {showForm && tab === 'requests' && (
                <form onSubmit={createRequest} className="card p-5 space-y-3">
                    <Input name="title" label="Title" required />
                    <Textarea name="description" label="Description" required />
                    <div className="grid gap-3 sm:grid-cols-3">
                        <Select name="category" label="Category">{SERVICE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
                        <Input name="budgetMin" label="Min (₹)" type="number" />
                        <Input name="budgetMax" label="Max (₹)" type="number" />
                    </div>
                    <Button type="submit">Post request</Button>
                </form>
            )}

            {showForm && tab === 'listings' && (
                <form onSubmit={createListing} className="card p-5 space-y-3">
                    <Input name="title" label="Service title" required />
                    <Textarea name="description" label="Description" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Select name="category" label="Category">{SERVICE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
                        <Input name="price" label="Starting price (₹)" type="number" required />
                    </div>
                    <Button type="submit">Publish listing</Button>
                </form>
            )}

            {tab === 'requests' && requests.map((r) => (
                <div key={r._id} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-bold">{r.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{r.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">{r.category}</span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{r.status}</span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{r.proposalCount} proposals</span>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => (selected === r._id ? setSelected(null) : openDetail(r._id))}>
                            {selected === r._id ? 'Hide' : 'View'}
                        </Button>
                    </div>
                    {selected === r._id && detail && (
                        <div className="mt-4 border-t border-slate-100 pt-4 space-y-3">
                            <h4 className="text-sm font-bold">Proposals</h4>
                            {detail.proposals.map((p) => (
                                <ProposalCard
                                    key={p._id}
                                    proposal={p}
                                    canAccept={String(detail.request.author._id) === String(user._id) && r.status === 'open'}
                                    onAccept={accept}
                                />
                            ))}
                            {!detail.proposals.length && <p className="text-sm text-slate-500">No proposals yet.</p>}
                            {String(detail.request.author._id) !== String(user._id) && r.status === 'open' && (
                                <form onSubmit={propose} className="space-y-2 rounded-xl border border-slate-200 p-3">
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <Input name="price" label="Price (₹)" type="number" required />
                                        <Input name="days" label="Delivery (days)" type="number" />
                                    </div>
                                    <Textarea name="message" label="Message" />
                                    <Button type="submit">Send proposal</Button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {tab === 'listings' && (
                <div className="grid gap-4 sm:grid-cols-2">
                    {listings.map((l) => <ServiceCard key={l._id} listing={l} />)}
                    {!listings.length && <p className="text-slate-500">No listings.</p>}
                </div>
            )}
        </div>
    );
}