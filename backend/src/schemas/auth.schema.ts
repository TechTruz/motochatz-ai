import * as z from 'zod';

export const RegisterSchema = z
    .strictObject({
        email: z.email(),
        password: z.string().min(8).max(64),
        repeatPassword: z.string(),
        firstName: z.string(),
        lastName: z.string().nullable().optional(),
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

export const LoginSchema = z.strictObject({
    email: z.email(),
    password: z.string().min(8).max(64),
});

export type RegisterPayload = z.infer<typeof RegisterSchema>;
export type LoginPayload = z.infer<typeof LoginSchema>;
