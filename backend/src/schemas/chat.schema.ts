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

export const CreateChatSchema = z.strictObject({
    userId: z.hex().length(24),
    garageId: z.hex().length(24),
});

export const GetManyChatMessagesSchema = z.strictObject({
    chatId: z.hex().length(24),
    cursor: z.hex().length(24).nullable().default(null),
    limit: z
        .string()
        .transform((val) => parseInt(val))
        .pipe(z.number().gte(0))
        .default(10),
    sort: z.enum(['createdAt', '-createdAt']).default('-createdAt'),
});

export type GetManyChatsPayload = z.infer<typeof GetManyChatsSchema>;
export type CreateChatPayload = z.infer<typeof CreateChatSchema>;
export type GetManyChatMessagesPayload = z.infer<
    typeof GetManyChatMessagesSchema
>;
