import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => (req, _res, next) => {
    try {
        const parsed = schema.parse(req[source]);
        req[source] = parsed;
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            next(ApiError.badRequest(err.issues[0]?.message || 'Invalid input', err.issues));
        } else next(err);
    }
};