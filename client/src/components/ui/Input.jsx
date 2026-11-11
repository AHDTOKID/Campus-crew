export function Input({ label, className = '', ...props }) {
    return (
        <label className="block">
            {label && <span className="label">{label}</span>}
            <input className={`input ${className}`} {...props} />
        </label>
    );
}

export function Textarea({ label, className = '', ...props }) {
    return (
        <label className="block">
            {label && <span className="label">{label}</span>}
            <textarea className={`input ${className}`} rows={3} {...props} />
        </label>
    );
}

export function Select({ label, children, className = '', ...props }) {
    return (
        <label className="block">
            {label && <span className="label">{label}</span>}
            <select className={`input ${className}`} {...props}>{children}</select>
        </label>
    );
}