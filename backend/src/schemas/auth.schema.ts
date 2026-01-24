import * as z from 'zod';

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(64),
    repeatPassword: z.string().min(8).max(64),
    firstName: z.string(),
    lastName: z.string().optional(),
    garageName: z.string().max(50),
});
