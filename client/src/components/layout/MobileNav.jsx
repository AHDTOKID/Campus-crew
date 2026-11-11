import { NavLink } from 'react-router-dom';
const ITEMS = [
    ['/app/feed', 'Feed', '◉'],
    ['/app/services', 'Services', '✦'],
    ['/app/market', 'Market', '◈'],
    ['/app/messages', 'Chat', '✉'],
    ['/app/profile', 'Me', '☺'],
];
export function MobileNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden">
            {ITEMS.map(([to, label, icon]) => (
                <NavLink key={to} to={to} className={({ isActive }) =>
                    `flex flex-col items-center gap-0.5 py-2 text-xs ${isActive ? 'text-brand-600' : 'text-slate-500'}`}>
                    <span>{icon}</span>{label}
                </NavLink>
            ))}
        </nav>
    );
}