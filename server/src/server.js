import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './socket.js';
import { setNotificationIo } from './services/notification.service.js';
import { seedIfEmpty } from './seed.js';

(async () => {
    await connectDB();
    await seedIfEmpty();
    const server = http.createServer(app);
    const io = initSocket(server);
    setNotificationIo(io);
    server.listen(env.port, () => console.log(`🚀 API http://localhost:${env.port}`));
})();