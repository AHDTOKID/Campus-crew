import { env } from './env.js';

/**
 * Media driver abstraction. `local` just returns a URL; swap for S3/Cloudinary
 * in production. Only metadata is stored in MongoDB — never the file itself.
 */
export const storage = {
    publicUrl(key) { return `${env.mediaBaseUrl}/${key}`; },
    async save() {
        // Placeholder for object-storage upload.
        throw new Error('Wire upload driver before enabling uploads');
    },
    async delete() { /* no-op for local driver */ },
};

export const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB