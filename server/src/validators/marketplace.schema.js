import { z } from 'zod';

export const createItemSchema = z.object({
    title: z.string().min(3),
    description: z.string().max(2000).optional(),
    category: z.string().default('Other'),
    condition: z.enum(['new', 'like-new', 'good', 'fair']).default('good'),
    price: z.coerce.number().nonnegative(),
    images: z.array(z.string().url()).max(6).optional(),
});

export const updateItemSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().max(2000).optional(),
    category: z.string().optional(),
    condition: z.enum(['new', 'like-new', 'good', 'fair']).optional(),
    price: z.coerce.number().nonnegative().optional(),
    status: z.enum(['available', 'reserved', 'sold']).optional(),
});