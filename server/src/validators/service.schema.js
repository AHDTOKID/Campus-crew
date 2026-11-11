import { z } from 'zod';

export const createRequestSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.string().default('Other'),
    budgetMin: z.coerce.number().nonnegative().optional(),
    budgetMax: z.coerce.number().nonnegative().optional(),
    deadline: z.string().datetime().optional(),
});

export const createListingSchema = z.object({
    title: z.string().min(3),
    description: z.string().max(2000).optional(),
    category: z.string().default('Other'),
    price: z.coerce.number().nonnegative(),
    priceBasis: z.enum(['starting-at', 'fixed', 'per-session', 'per-hour']).default('starting-at'),
    portfolioLinks: z.array(z.string().url()).optional(),
});

export const createProposalSchema = z.object({
    price: z.coerce.number().positive(),
    deliveryDays: z.coerce.number().positive().optional(),
    message: z.string().max(1000).optional(),
});