import { storage, ALLOWED_MIME, MAX_UPLOAD_BYTES } from '../config/storage.js';
import { ApiError } from '../utils/ApiError.js';

export function buildUploadUrl({ mimeType, size }) {
    if (!ALLOWED_MIME.includes(mimeType)) throw ApiError.badRequest('Unsupported media type');
    if (size > MAX_UPLOAD_BYTES) throw ApiError.badRequest('File too large');
    // In production: return a signed upload URL from the storage provider.
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return { uploadUrl: `${storage.publicUrl(key)}?sig=stub`, publicUrl: storage.publicUrl(key) };
}