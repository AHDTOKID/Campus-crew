import { ApiError } from '../utils/ApiError.js';
export const requireRole = (...roles) => (req, _res, next) =>
    roles.includes(req.user?.role) ? next() : next(ApiError.forbidden('Insufficient permissions'));

export const requireModerator = requireRole('moderator', 'admin');
export const requireAdmin = requireRole('admin');