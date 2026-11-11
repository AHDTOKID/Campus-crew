import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Loader, Badge } from '../../components/ui/Loader';
import { NOTICE_CATEGORIES } from '../../lib/constants';

export default function Notices() {
    const [items, setItems] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const load = () => api.get('/notices').then(setItems);
    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault();
        const f = e.target;
        await api.post('/notices', {
            title: f.title.value, body: f.body.value, category: f.category.value,
            eventDate: f.eventDate.value || undefined, location: f.location.value, link: f.link.value,
        });
        f.reset(); setShowForm(false); load();
    };

    if (!items) return <Loader />;
    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-extrabold">Notice Board</h1>
                <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Close' : 'Post'}</Button>
            </div>
            {showForm && (
                <form onSubmit={submit} className="card p-5 space-y-3">
                    <Input name="title" label="Title" required />
                    <Textarea name="body" label="Details" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Select name="category" label="Category">{NOTICE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
                        <Input name="eventDate" label="Event date" type="date" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Input name="location" label="Location" />
                        <Input name="link" label="Link" />
                    </div>
                    <Button type="submit">Publish</Button>
                </form>
            )}
            {items.map((n) => (
                <div key={n._id} className="card p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{n.title}</h3>
                        <Badge tone={n.sourceLabel === 'official' ? 'brand' : 'slate'}>{n.sourceLabel}</Badge>
                        <Badge>{n.category}</Badge>
                    </div>
                    {n.body && <p className="mt-2 text-sm text-slate-600">{n.body}</p>}
                    <p className="mt-2 text-xs text-slate-500">
                        {n.eventDate && <>📅 {new Date(n.eventDate).toLocaleDateString()} · </>}
                        {n.location && <>📍 {n.location} · </>}by {n.author?.name}
                    </p>
                </div>
            ))}
        </div>
    );
}