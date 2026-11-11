import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: '7d' });

export const protect = asyncHandler(async (req, _res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw ApiError.unauthorized();
    let payload;
    try { payload = jwt.verify(token, env.jwtSecret); }
    catch { throw ApiError.unauthorized('Invalid or expired session'); }
    const user = await User.findById(payload.id);
    if (!user) throw ApiError.unauthorized('Account not found');
    req.user = user;
    next();
});