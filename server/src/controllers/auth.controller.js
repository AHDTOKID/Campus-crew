import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import College from '../models/College.js';
import { signToken } from '../middleware/auth.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { submitVerification } from '../services/verification.service.js';

async function payload(user) {
    const college = user.collegeId ? await College.findById(user.collegeId) : null;
    return { user: user.toPublicDTO(), college };
}

export const register = asyncHandler(async (req, res) => {
    const data = req.body;
    const college = await College.findOne({ _id: data.collegeId, isPublished: true });
    if (!college) throw ApiError.badRequest('College not found');
    if (await User.exists({ email: data.email.toLowerCase() })) throw ApiError.conflict('Email already registered');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, email: data.email.toLowerCase(), passwordHash });
    const body = await payload(user);
    res.status(201).json({ token: signToken(user), ...body });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw ApiError.unauthorized('Invalid email or password');
    }
    const body = await payload(user);
    res.json({ token: signToken(user), ...body });
});

export const me = asyncHandler(async (req, res) => res.json(await payload(req.user)));

export const updateMe = asyncHandler(async (req, res) => {
    const allowed = ['name', 'department', 'year', 'bio', 'skills', 'avatarUrl'];
    for (const k of allowed) if (k in req.body) req.user[k] = req.body[k];
    await req.user.save();
    res.json(await payload(req.user));
});

export const submitMyVerification = asyncHandler(async (req, res) => {
    const v = await submitVerification(req.user, req.body);
    res.status(201).json({ message: 'Submitted for review', verification: v });
});

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) throw ApiError.badRequest('Current password incorrect');
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
});