import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    collegeId: z.string().min(1),
    department: z.string().optional(),
    year: z.coerce.number().min(1).max(6).optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const verificationSchema = z.object({
    studentIdUrl: z.string().url().optional(),
    note: z.string().max(500).optional(),
});