import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setToken, getToken } from '../lib/api';

const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        if (!getToken()) { setLoading(false); return; }
        try {
            const data = await api.get('/auth/me');
            setUser(data.user); setCollege(data.college);
        } catch (err) {
            if (err?.status === 401 || err?.status === 403) {
                setToken(null); setUser(null); setCollege(null);
            }
        }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const apply = (data) => { setToken(data.token); setUser(data.user); setCollege(data.college); return data.user; };
    const login = (email, password) => api.post('/auth/login', { email, password }).then(apply);
    const register = (payload) => api.post('/auth/register', payload).then(apply);
    const logout = () => { setToken(null); setUser(null); setCollege(null); };

    return <AuthContext.Provider value={{ user, college, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
}