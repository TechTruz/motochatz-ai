import * as z from 'zod';

export const registerSchema: z.ZodObject = z
    .object({
        email: z.email(),
        password: z.string().min(8).max(64),
        repeatPassword: z.string(),
        firstName: z.string(),
        lastName: z.string().optional(),
        garageName: z.string().max(50),
    })
    .superRefine(({ password, repeatPassword }, ctx) => {
        if (repeatPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords do not match',
                path: ['repeatPassword'],
            });
        }
    });
