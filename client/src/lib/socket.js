import { io } from 'socket.io-client';
import { getToken } from './api';

export function createSocket() {
    return io(import.meta.env.VITE_SOCKET_URL || '/', {
        auth: { token: getToken() },
        transports: ['websocket', 'polling'],
    });
}