import mongoose from 'mongoose';
import fs from 'fs';
import { env } from './env.js';

let memServer = null;

export async function connectDB() {
    if (mongoose.connection.readyState === 1) return;
    let uri = env.mongoUri;
    if (!uri) {
        if (!process.env.MONGOMS_SYSTEM_BINARY && fs.existsSync('/opt/homebrew/bin/mongod')) {
            process.env.MONGOMS_SYSTEM_BINARY = '/opt/homebrew/bin/mongod';
        }
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memServer = await MongoMemoryServer.create({
            instance: { storageEngine: 'wiredTiger' },
        });
        uri = memServer.getUri();
        console.log('⚠  No MONGO_URI — using in-memory MongoDB (resets on restart)');
    }
    await mongoose.connect(uri);
    console.log('✔  MongoDB connected');
}

export async function disconnectDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (memServer) {
        await memServer.stop();
        memServer = null;
    }
}