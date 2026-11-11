import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const FEATURES = [
    ['Freelance & Services', 'Post a requirement, receive proposals, or advertise your skills.'],
    ['Student Marketplace', 'Buy and sell within your college.'],
    ['Campus Feed', 'Share photos, videos and updates with your community.'],
    ['Notice Board', 'Hackathons, internships, club recruitment.'],
    ['Real-time Messaging', 'Discuss requirements and close deals securely.'],
    ['Campus Explore', 'Authentic reviews and photos for freshers.'],
];

export default function Landing() {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-brand-50">
            <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                <span className="text-xl font-extrabold">Campus<span className="text-brand-600">Crew</span></span>
                <nav className="flex items-center gap-3">
                    <Link to="/explore" className="hidden sm:block rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white">Explore Colleges</Link>
                    {user ? (
                        <Link to="/app/dashboard" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Go to Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">Log in</Link>
                            <Link to="/register" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Join</Link>
                        </>
                    )}
                </nav>
            </header>
            <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 text-center">
                <span className="inline-flex rounded-full bg-brand-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">Multi-college student ecosystem</span>
                <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                    Your Campus. Your Community. <span className="text-brand-600">Your Opportunities.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
                    One platform for student freelancing, secondhand trading, campus social life and authentic college discovery.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Create your account</Link>
                    <Link to="/explore" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">Explore colleges</Link>
                </div>
            </section>
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(([t, b]) => (
                        <div key={t} className="card p-6"><h3 className="font-bold">{t}</h3><p className="mt-2 text-sm text-slate-600">{b}</p></div>
                    ))}
                </div>
            </section>
        </div>
    );
}