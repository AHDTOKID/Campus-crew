export function Loader() {
    return (
        <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
        </div>
    );
}

export function Empty({ title, hint }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 py-14 text-center">
            <p className="font-semibold text-slate-700">{title}</p>
            {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
        </div>
    );
}

export function Badge({ tone = 'slate', children }) {
    const tones = {
        slate: 'bg-slate-100 text-slate-700', brand: 'bg-brand-50 text-brand-700',
        green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700',
        rose: 'bg-rose-50 text-rose-700',
    };
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}