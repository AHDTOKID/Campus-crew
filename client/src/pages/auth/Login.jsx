import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true); setError('');
        try {
            const u = await login(form.email, form.password);
            navigate(u?.role === 'admin' ? '/app/admin' : '/app/dashboard');
        }
        catch (err) { setError(err.message); }
        finally { setBusy(false); }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-8">
                <Link to="/" className="text-lg font-extrabold">Campus<span className="text-brand-600">Crew</span></Link>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
                <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <Button type="submit" disabled={busy} className="w-full">{busy ? 'Signing in…' : 'Sign in'}</Button>
                <p className="text-center text-sm text-slate-500">New? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link></p>
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                    <p className="font-semibold text-slate-600">Demo</p>
                    <p>riya@cu.dev / student123</p>
                    <p>admin@campuscrew.dev / admin123</p>
                </div>
            </form>
        </div>
    );
}