import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Loader';

const NAV = [
    ['/app/dashboard', 'Dashboard', '◧'],
    ['/app/feed', 'Campus Feed', '◉'],
    ['/app/services', 'Freelance & Services', '✦'],
    ['/app/market', 'Marketplace', '◈'],
    ['/app/notices', 'Notice Board', '▤'],
    ['/app/messages', 'Messages', '✉'],
    ['/app/explore', 'Campus Explore', '◎'],
    ['/app/profile', 'My Profile', '☺'],
];

export function Sidebar() {
    const { user, college, logout } = useAuth();
    const navigate = useNavigate();
    if (!user) return null;
    const verifyTone = { verified: 'green', pending: 'amber', rejected: 'rose', unverified: 'slate' }[user.status];

    return (
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
            <div className="px-6 py-6">
                <button onClick={() => navigate('/app/dashboard')} className="text-left">
                    <p className="text-lg font-extrabold">Campus<span className="text-brand-600">Crew</span></p>
                    <p className="mt-1 text-xs text-slate-500">{college?.name || 'Platform'}</p>
                </button>
            </div>
            <nav className="flex-1 space-y-1 px-3">
                {NAV.map(([to, label, icon]) => (
                    <NavLink key={to} to={to} className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <span>{icon}</span>{label}
                    </NavLink>
                ))}
                {user.role === 'admin' && (
                    <NavLink to="/app/admin" className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <span>⚙</span>Administration
                    </NavLink>
                )}
            </nav>
            <div className="border-t border-slate-200 p-4">
                <div className="flex items-center gap-3">
                    <Avatar name={user.name} src={user.avatarUrl} />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <Badge tone={verifyTone}>{user.status}</Badge>
                    </div>
                </div>
                <button onClick={() => { logout(); navigate('/'); }} className="mt-3 w-full rounded-xl px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-100">
                    Sign out
                </button>
            </div>
        </aside>
    );
}