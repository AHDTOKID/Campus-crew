import { useState } from 'react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function ManageColleges() {
    const [form, setForm] = useState({ name: '', city: '', state: '' });
    const [msg, setMsg] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        await api.post('/admin/colleges', form);
        setMsg('College added');
        setForm({ name: '', city: '', state: '' });
    };
    return (
        <form onSubmit={submit} className="card p-5 space-y-3">
            {msg && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>}
            <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
                <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <Button type="submit">Add college</Button>
        </form>
    );
}