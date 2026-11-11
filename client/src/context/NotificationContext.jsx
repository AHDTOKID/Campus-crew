import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from './SocketContext';
import { api } from '../lib/api';

const Ctx = createContext(null);
export const useNotifications = () => useContext(Ctx);

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [unread, setUnread] = useState(0);

    const reload = () => api.get('/notifications').then((d) => setUnread(d.unread)).catch(() => { });
    useEffect(() => { if (user) reload(); }, [user]);
    useEffect(() => {
        if (!socket) return;
        const h = () => setUnread((n) => n + 1);
        socket.on('notification', h);
        return () => socket.off('notification', h);
    }, [socket]);

    return <Ctx.Provider value={{ unread, reload }}>{children}</Ctx.Provider>;
}