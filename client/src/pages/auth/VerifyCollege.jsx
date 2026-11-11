import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';

export default function VerifyCollege() {
    const { refresh } = useAuth();
    const [idUrl, setIdUrl] = useState('');
    const [note, setNote] = useState('');
    const [msg, setMsg] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        await api.post('/verification', { studentIdUrl: idUrl, note });
        await refresh();
        setMsg('Submitted for review');
    };

    return (
        <form onSubmit={submit} className="card space-y-3 p-5">
            <h1 className="text-xl font-bold">College verification</h1>
            {msg && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>}
            <Input label="Student ID URL" value={idUrl} onChange={(e) => setIdUrl(e.target.value)} placeholder="https://…" />
            <Textarea label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <Button type="submit">Submit</Button>
        </form>
    );
}