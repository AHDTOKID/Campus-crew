export function Button({ variant = 'primary', className = '', ...props }) {
    const styles = {
        primary: 'bg-brand-600 hover:bg-brand-700 text-white',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
        outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white',
        soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
    }[variant];
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${styles} ${className}`}
            {...props}
        />
    );
}