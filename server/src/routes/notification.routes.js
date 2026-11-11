import { Router } from 'express';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const r = Router();
r.get('/', asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50);
    const unread = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ notifications, unread });
}));
r.patch('/read-all', asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'Read' });
}));
r.patch('/:id/read', asyncHandler(async (req, res) => {
    await Notification.updateOne({ _id: req.params.id, user: req.user._id }, { read: true });
    res.json({ message: 'Read' });
}));
export default r;