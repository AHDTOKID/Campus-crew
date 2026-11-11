import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [colleges, setColleges] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '', collegeId: '', department: '', year: 1 });
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => { api.get('/colleges').then(setColleges); }, []);

    const submit = async (e) => {
        e.preventDefault(); setBusy(true); setError('');
        try { await register({ ...form, year: Number(form.year) }); navigate('/app/dashboard'); }
        catch (err) { setError(err.message); }
        finally { setBusy(false); }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <form onSubmit={submit} className="card w-full max-w-lg space-y-4 p-8">
                <Link to="/" className="text-lg font-extrabold">Campus<span className="text-brand-600">Crew</span></Link>
                <h1 className="text-2xl font-bold">Join your college network</h1>
                {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
                <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="Password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <Select label="College" required value={form.collegeId} onChange={(e) => setForm({ ...form, collegeId: e.target.value })}>
                    <option value="">Select your college…</option>
                    {colleges.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </Select>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                    <Select label="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                        {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
                    </Select>
                </div>
                <Button type="submit" disabled={busy} className="w-full">{busy ? 'Creating…' : 'Create account'}</Button>
                <p className="text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-brand-600">Log in</Link></p>
            </form>
        </div>
    );
}