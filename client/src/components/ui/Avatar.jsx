export function Avatar({ name = '?', src, size = 9 }) {
    if (src) return <img src={src} alt={name} className={`h-${size} w-${size} rounded-full object-cover`} />;
    return (
        <div className={`flex h-${size} w-${size} items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
}