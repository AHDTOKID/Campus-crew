import { z } from 'zod';

export const createPostSchema = z.object({
    text: z.string().max(2000).optional(),
    media: z.array(z.string().url()).max(4).optional(),
    nominatePublic: z.boolean().optional(),
}).refine((d) => d.text || (d.media && d.media.length), { message: 'Provide text or media' });

export const commentSchema = z.object({
    text: z.string().min(1).max(1000),
    parentCommentId: z.string().optional(),
});