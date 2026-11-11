import Notification from '../models/Notification.js';

let ioRef = null;
export const setNotificationIo = (io) => { ioRef = io; };

export async function notifyUser({ user, collegeId, type, text, link }) {
    if (!user) return null;
    const n = await Notification.create({ user, collegeId, type, text, link });
    ioRef?.to(`user:${user}`).emit('notification', n);
    return n;
}