import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 30,
    standardHeaders: true, legacyHeaders: false,
    message: { message: 'Too many auth attempts, try again later' },
});

export const writeLimiter = rateLimit({
    windowMs: 60 * 1000, max: 60,
    standardHeaders: true, legacyHeaders: false,
    message: { message: 'Too many requests, slow down' },
});