import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Loader';
import { CommentSection } from './CommentSection';
import { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export function PostCard({ post, onLike }) {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const liked = post.likes?.includes(user?._id);
    return (
        <div className="card p-5">
            <div className="flex items-center gap-3">
                <Avatar name={post.author?.name} src={post.author?.avatarUrl} />
                <div>
                    <p className="text-sm font-semibold">{post.author?.name}</p>
                    <p className="text-xs text-slate-500">{post.author?.department} · {new Date(post.createdAt).toLocaleString()}</p>
                </div>
                {post.visibility === 'public-nominated' && (
                    <span className="ml-auto">
                        <Badge tone={post.publicationState === 'approved' ? 'green' : 'amber'}>{post.publicationState}</Badge>
                    </span>
                )}
            </div>
            {post.text && <p className="mt-3 whitespace-pre-wrap text-slate-800">{post.text}</p>}
            {post.media?.map((src, i) => <img key={i} src={src} alt="" className="mt-3 max-h-96 w-full rounded-xl object-cover" />)}
            <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm">
                <button onClick={() => onLike?.(post._id)} className={`font-semibold ${liked ? 'text-brand-600' : 'text-slate-500'}`}>♥ {post.likes?.length || 0}</button>
                <button onClick={() => setShowComments((s) => !s)} className="font-semibold text-slate-500">💬 {post.commentCount || 0}</button>
            </div>
            {showComments && <CommentSection postId={post._id} />}
        </div>
    );
}