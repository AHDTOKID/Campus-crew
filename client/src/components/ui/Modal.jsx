export function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div className="card max-w-lg w-full" onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    );
}