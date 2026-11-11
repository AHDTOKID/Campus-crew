import { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea, Input } from '../ui/Input';
import { api } from '../../lib/api';

export function PostComposer({ onPosted }) {
    const [text, setText] = useState('');
    const [media, setMedia] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!text.trim() && !media.trim()) return;
        setBusy(true);
        try {
            const post = await api.post('/social', {
                text: text.trim(),
                media: media.split(',').map((s) => s.trim()).filter(Boolean),
                nominatePublic: isPublic,
            });
            onPosted?.(post);
            setText(''); setMedia(''); setIsPublic(false);
        } finally { setBusy(false); }
    };

    return (
        <form onSubmit={submit} className="card p-5 space-y-3">
            <Textarea placeholder="Share something with your campus…" value={text} onChange={(e) => setText(e.target.value)} />
            <Input placeholder="Image URLs (comma separated)" value={media} onChange={(e) => setMedia(e.target.value)} />
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                    Nominate for public Campus Explore
                </label>
                <Button type="submit" disabled={busy}>{busy ? 'Posting…' : 'Post'}</Button>
            </div>
        </form>
    );
}