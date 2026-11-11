import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Loader } from '../../components/ui/Loader';

export default function EditProfile() {
    const { user, refresh } = useAuth();
    const navigate = useNavigate();
    if (!user) return <Loader />;
    return <EditProfileForm user={user} refresh={refresh} navigate={navigate} />;
}

function EditProfileForm({ user, refresh, navigate }) {
    const [form, setForm] = useState({
        name: user.name || '', department: user.department || '', year: user.year || 1,
        bio: user.bio || '', skills: (user.skills || []).join(', '),
    });
    const submit = async (e) => {
        e.preventDefault();
        await api.patch('/auth/me', { ...form, year: Number(form.year), skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) });
        await refresh(); navigate('/app/profile');
    };
    return (
        <form onSubmit={submit} className="card p-5 space-y-3">
            <h1 className="text-xl font-bold">Edit profile</h1>
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                <Input label="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </div>
            <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <Input label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            <Button type="submit">Save</Button>
        </form>
    );
}