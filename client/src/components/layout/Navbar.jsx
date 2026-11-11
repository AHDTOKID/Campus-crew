import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';

export function Navbar() {
    const { user } = useAuth();
    const { unread } = useNotifications();
    if (!user) return null;
    return (
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
            <NavLink to="/app/dashboard" className="font-extrabold">Campus<span className="text-brand-600">Crew</span></NavLink>
            <NavLink to="/app/notifications" className="relative text-sm text-slate-600">
                🔔
                {unread > 0 && <span className="absolute -right-2 -top-1 h-4 min-w-4 rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
            </NavLink>
        </header>
    );
}