import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createSocket } from '../lib/socket';
import { useAuth } from '../hooks/useAuth';

const Ctx = createContext(null);
export const useSocket = () => useContext(Ctx);

export function SocketProvider({ children }) {
    const { user } = useAuth();
    const ref = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!user) { ref.current?.disconnect(); ref.current = null; return; }
        const s = createSocket();
        s.on('connect', () => setConnected(true));
        s.on('disconnect', () => setConnected(false));
        ref.current = s;
        return () => s.disconnect();
    }, [user]);

    return <Ctx.Provider value={{ socket: ref.current, connected }}>{children}</Ctx.Provider>;
}