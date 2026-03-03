import * as z from 'zod';

export const GetManyChatsSchema = z.strictObject({
    garageId: z.hex().length(24),
    userId: z.hex().length(24).nullable().default(null),
    limit: z
        .string()
        .transform((val) => parseInt(val))
        .pipe(z.number().gte(0))
        .default(5),
    page: z
        .string()
        .transform((val) => parseInt(val))
        .pipe(z.number().gte(1))
        .default(1),
    status: z.enum(['ALL', 'ONGOING', 'ENDED']).default('ALL'),
    sort: z
        .enum([
            'chatId',
            '-chatId',
            'createdAt',
            '-createdAt',
            'updatedAt',
            '-updatedAt',
        ])
        .default('chatId'),
});

export type GetManyChatsPayload = z.infer<typeof GetManyChatsSchema>;
export type CreateChatPayload = {
    userId: string;
    garageId: string;
};
