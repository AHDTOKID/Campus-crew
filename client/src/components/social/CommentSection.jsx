import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

function Thread({ comment, all, onReply, depth = 0 }) {
    const children = all.filter((c) => c.parentComment && String(c.parentComment) === String(comment._id));
    return (
        <div className={depth ? 'ml-8 border-l border-slate-200 pl-4' : ''}>
            <div className="py-2">
                <div className="flex items-center gap-2">
                    <Avatar name={comment.author?.name} src={comment.author?.avatarUrl} size={7} />
                    <span className="text-sm font-semibold">{comment.author?.name}</span>
                </div>
                <p className="mt-1 pl-9 text-sm text-slate-700">{comment.text}</p>
                <button onClick={() => onReply(comment)} className="ml-9 text-xs font-semibold text-brand-600">Reply</button>
            </div>
            {children.map((c) => <Thread key={c._id} comment={c} all={all} onReply={onReply} depth={depth + 1} />)}
        </div>
    );
}

export function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState(null);

    const load = () => api.get(`/social/${postId}/comments`).then(setComments);
    useEffect(() => { load(); }, [postId]);

    const submit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        await api.post(`/comments/post/${postId}`, { text, parentCommentId: replyTo?._id });
        setText(''); setReplyTo(null); load();
    };

    return (
        <div className="mt-3 border-t border-slate-100 pt-3">
            {comments.filter((c) => !c.parentComment).map((c) => (
                <Thread key={c._id} comment={c} all={comments} onReply={setReplyTo} />
            ))}
            <form onSubmit={submit} className="mt-2">
                {replyTo && <p className="mb-1 text-xs text-brand-600">Replying to {replyTo.author?.name} <button type="button" onClick={() => setReplyTo(null)} className="ml-2 text-slate-400">cancel</button></p>}
                <div className="flex gap-2">
                    <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment…" />
                    <Button type="submit">Send</Button>
                </div>
            </form>
        </div>
    );
}