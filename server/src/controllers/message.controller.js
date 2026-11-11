import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { getSocketIo } from '../socket.js';
import { notifyUser } from '../services/notification.service.js';

export const listConversations = asyncHandler(async (req, res) => {
    const convos = await Conversation.find({ collegeId: req.collegeId, participants: req.user._id })
        .populate('participants', 'name avatarUrl department year').sort('-lastMessageAt');
    res.json(convos);
});

export const startConversation = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (String(userId) === String(req.user._id)) throw ApiError.badRequest('Cannot message yourself');
    const other = await User.findOne({ _id: userId, collegeId: req.collegeId, status: 'verified' });
    if (!other) throw ApiError.notFound('Student not in your college');
    if (req.user.blockedUsers?.some((u) => String(u) === String(userId))) throw ApiError.forbidden('Blocked');

    let convo = await Conversation.findOne({
        collegeId: req.collegeId,
        participants: { $all: [req.user._id, other._id], $size: 2 },
    });
    if (!convo) convo = await Conversation.create({ collegeId: req.collegeId, participants: [req.user._id, other._id] });
    await convo.populate('participants', 'name avatarUrl');
    res.status(201).json(convo);
});

export const getMessages = asyncHandler(async (req, res) => {
    const convo = await Conversation.findOne({
        _id: req.params.id, collegeId: req.collegeId, participants: req.user._id,
    });
    if (!convo) throw ApiError.notFound();
    const messages = await Message.find({ conversation: convo._id })
        .populate('sender', 'name avatarUrl').sort('createdAt');
    await Message.updateMany({ conversation: convo._id, readBy: { $ne: req.user._id } }, { $addToSet: { readBy: req.user._id } });
    res.json({ conversation: convo, messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
    const convo = await Conversation.findOne({
        _id: req.params.id, collegeId: req.collegeId, participants: req.user._id,
    });
    if (!convo) throw ApiError.notFound();
    const message = await Message.create({
        conversation: convo._id, sender: req.user._id, text: req.body.text, readBy: [req.user._id],
    });
    convo.lastMessageAt = new Date();
    convo.lastMessage = req.body.text.slice(0, 120);
    await convo.save();
    await message.populate('sender', 'name avatarUrl');

    const io = getSocketIo();
    io?.to(`conversation:${convo._id}`).emit('message:new', message);
    for (const p of convo.participants) {
        if (String(p) !== String(req.user._id)) {
            io?.to(`user:${p}`).emit('message:new', message);
            await notifyUser({ user: p, collegeId: req.collegeId, type: 'message.new', text: `New message from ${req.user.name}`, link: `/app/messages/${convo._id}` });
        }
    }
    res.status(201).json(message);
});