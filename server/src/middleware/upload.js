import { ALLOWED_MIME, MAX_UPLOAD_BYTES } from '../config/storage.js';
import { ApiError } from '../utils/ApiError.js';

export function validateUploadMeta(req, _res, next) {
    const { mimeType, size } = req.body;
    if (!mimeType || !ALLOWED_MIME.includes(mimeType)) return next(ApiError.badRequest('Unsupported media type'));
    if (!size || size > MAX_UPLOAD_BYTES) return next(ApiError.badRequest('File exceeds size limit'));
    next();
}