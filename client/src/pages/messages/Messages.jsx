import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../lib/api';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';

export default function Messages() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const { id } = useParams();
    const navigate = useNavigate();
    const [convos, setConvos] = useState(null);
    const [thread, setThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    const other = (c) => c.participants?.find((p) => String(p._id || p) !== String(user?._id));

    useEffect(() => { api.get('/messages').then(setConvos); }, []);

    useEffect(() => {
        if (!id) { setThread(null); setMessages([]); return; }
        api.get(`/messages/${id}`).then((d) => { setThread(d.conversation); setMessages(d.messages); });
        socket?.emit('conversation:join', id, (r) => { if (!r?.ok) console.warn('join failed'); });
        return () => socket?.emit('conversation:leave', id);
    }, [id, socket]);

    useEffect(() => {
        if (!socket) return;
        const h = (m) => { if (m.conversation === id) setMessages((mm) => [...mm, m]); };
        socket.on('message:new', h);
        return () => socket.off('message:new', h);
    }, [socket, id]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = async (e) => {
        e.preventDefault();
        if (!text.trim() || !id) return;
        const msg = await api.post(`/messages/${id}`, { text });
        setMessages((m) => [...m, msg]); setText('');
    };

    if (!convos) return <Loader />;
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-extrabold">Messages</h1>
            <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
                <div className="card max-h-[70vh] overflow-y-auto p-2">
                    {convos.map((c) => {
                        const o = other(c);
                        return (
                            <button key={c._id} onClick={() => navigate(`/app/messages/${c._id}`)}
                                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50 ${id === c._id ? 'bg-brand-50' : ''}`}>
                                <Avatar name={o?.name} src={o?.avatarUrl} />
                                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{o?.name}</p><p className="truncate text-xs text-slate-500">{c.lastMessage || 'Say hello'}</p></div>
                            </button>
                        );
                    })}
                    {!convos.length && <p className="p-4 text-sm text-slate-500">No conversations yet.</p>}
                </div>
                <div className="card flex max-h-[70vh] flex-col">
                    {!thread ? (
                        <p className="p-6 text-center text-sm text-slate-500">Select a conversation.</p>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <Avatar name={other(thread)?.name} src={other(thread)?.avatarUrl} />
                                <p className="font-semibold">{other(thread)?.name}</p>
                            </div>
                            <div className="flex-1 space-y-2 overflow-y-auto py-3">
                                {messages.map((m) => {
                                    const mine = String(m.sender?._id || m.sender) === String(user?._id);
                                    return (
                                        <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'}`}>{m.text}</div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>
                            <form onSubmit={send} className="flex gap-2 border-t border-slate-100 pt-3">
                                <input className="input" placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} />
                                <Button type="submit">Send</Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}