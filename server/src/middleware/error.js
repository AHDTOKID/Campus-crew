import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res) =>
    res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });

export function errorHandler(err, _req, res, _next) {
    const status = err instanceof ApiError ? err.status : err.status || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({
        message: err.message || 'Server error',
        ...(err.details ? { details: err.details } : {}),
    });
}