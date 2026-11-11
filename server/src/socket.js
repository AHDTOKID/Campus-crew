import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './config/env.js';
import Conversation from './models/Conversation.js';

let ioRef = null;
export const getSocketIo = () => ioRef;

export function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: { origin: env.clientOrigin, credentials: true },
    });

    io.use((socket, next) => {
        try {
            const payload = jwt.verify(socket.handshake.auth?.token, env.jwtSecret);
            socket.userId = String(payload.id);
            next();
        } catch { next(new Error('unauthorized')); }
    });

    io.on('connection', (socket) => {
        socket.join(`user:${socket.userId}`);

        socket.on('conversation:join', async (conversationId, ack) => {
            // SRS FR-G02 / AT-09: verify membership before joining.
            const convo = await Conversation.exists({ _id: conversationId, participants: socket.userId });
            if (!convo) return ack?.({ ok: false, error: 'not a member' });
            socket.join(`conversation:${conversationId}`);
            ack?.({ ok: true });
        });

        socket.on('conversation:leave', (id) => socket.leave(`conversation:${id}`));
    });

    ioRef = io;
    return io;
}