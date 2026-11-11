import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/ui/Avatar';
import { Badge, Loader } from '../../components/ui/Loader';

export default function Profile() {
    const { user, college } = useAuth();
    if (!user) return <Loader />;
    const tone = { verified: 'green', pending: 'amber', rejected: 'rose', unverified: 'slate' }[user.status] || 'slate';
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-extrabold">My Profile</h1>
            <div className="card p-5 flex items-center gap-4">
                <Avatar name={user.name} src={user.avatarUrl} size={16} />
                <div>
                    <p className="text-lg font-bold">{user.name}</p>
                    <p className="text-sm text-slate-500">{college?.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                        <Badge tone={tone}>Affiliation: {user.status}</Badge>
                        <Badge>{user.role}</Badge>
                    </div>
                </div>
            </div>
            <div className="card p-5">
                <h2 className="font-bold">Bio</h2>
                <p className="mt-1 text-sm text-slate-600">{user.bio || 'No bio yet.'}</p>
                {user.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">{user.skills.map((s) => <Badge key={s}>{s}</Badge>)}</div>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                <Link to="/app/profile/edit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Edit profile</Link>
                {user.status !== 'verified' && <Link to="/app/profile/verify" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Submit verification</Link>}
            </div>
        </div>
    );
}