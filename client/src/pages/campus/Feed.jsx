import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/ui/Loader';
import { PostCard } from '../../components/social/PostCard';
import { PostComposer } from '../../components/social/PostComposer';

export default function Feed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState(null);

    const load = () => api.get('/social').then((d) => setPosts(d.items));
    useEffect(() => { load(); }, []);

    const like = async (id) => {
        const r = await api.post(`/social/${id}/like`);
        setPosts((ps) => ps.map((p) => (p._id === id ? {
            ...p,
            likes: r.liked
                ? [...(p.likes || []), user?._id]
                : (p.likes || []).filter((uid) => String(uid) !== String(user?._id)),
        } : p)));
    };

    if (!posts) return <Loader />;
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-extrabold">Campus Feed</h1>
            <PostComposer onPosted={(p) => setPosts([p, ...posts])} />
            {posts.map((p) => <PostCard key={p._id} post={p} onLike={like} />)}
            {!posts.length && <p className="text-slate-500">No posts yet.</p>}
        </div>
    );
}