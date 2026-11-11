const BASE = import.meta.env.VITE_API_URL || '/api';
let token = localStorage.getItem('cc_token');

export const setToken = (t) => {
    token = t;
    if (t) localStorage.setItem('cc_token', t); else localStorage.removeItem('cc_token');
};
export const getToken = () => token;

async function request(path, { method = 'GET', body } = {}) {
    const res = await fetch(BASE + path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.message || `Request failed (${res.status})`);
        err.status = res.status;
        throw err;
    }
    return data;
}

export const api = {
    get: (p) => request(p),
    post: (p, b) => request(p, { method: 'POST', body: b }),
    patch: (p, b) => request(p, { method: 'PATCH', body: b }),
    del: (p) => request(p, { method: 'DELETE' }),
};