import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { Loader } from '../../components/ui/Loader';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { MARKET_CATEGORIES } from '../../lib/constants';

export default function Marketplace() {
    const { user } = useAuth();
    const [items, setItems] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ q: '', category: '' });

    const load = async () => {
        const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
        const d = await api.get(`/market${qs ? `?${qs}` : ''}`);
        setItems(d.items);
    };
    useEffect(() => { load(); }, [filters]);

    const create = async (e) => {
        e.preventDefault();
        const f = e.target;
        await api.post('/market', {
            title: f.title.value, description: f.description.value, category: f.category.value,
            condition: f.condition.value, price: Number(f.price.value),
            images: f.images.value.split(',').map((s) => s.trim()).filter(Boolean),
        });
        f.reset(); setShowForm(false); load();
    };

    const setStatus = async (id, status) => { await api.patch(`/market/${id}`, { status }); load(); };

    if (!items) return <Loader />;
    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-extrabold">Buy & Sell</h1>
                <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Close' : 'Sell an item'}</Button>
            </div>
            <div className="card flex flex-wrap gap-3 p-4">
                <input className="input flex-1" placeholder="Search…" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
                <select className="input w-48" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                    <option value="">All categories</option>
                    {MARKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
            </div>
            {showForm && (
                <form onSubmit={create} className="card p-5 space-y-3">
                    <Input name="title" label="Title" required />
                    <Textarea name="description" label="Description" />
                    <div className="grid gap-3 sm:grid-cols-3">
                        <Select name="category" label="Category">{MARKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
                        <Select name="condition" label="Condition">
                            <option value="new">New</option><option value="like-new">Like new</option>
                            <option value="good">Good</option><option value="fair">Fair</option>
                        </Select>
                        <Input name="price" label="Price (₹)" type="number" required />
                    </div>
                    <Input name="images" label="Image URLs (comma separated)" />
                    <Button type="submit">List item</Button>
                </form>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((it) => (
                    <ProductCard key={it._id} item={it} onStatus={setStatus} isOwner={String(it.seller?._id) === String(user._id)} />
                ))}
                {!items.length && <p className="text-slate-500">Nothing listed yet.</p>}
            </div>
        </div>
    );
}