import * as z from 'zod';

export const GetSignedUrlSchema = z.strictObject({
    fileName: z
        .string()
        .regex(/^[\w\-. ]$/, {
            error: "fileName only allow alphanumerics, dots '.', underscores '_', dashes '-', or whitespaces ' '",
        })
        .max(200),
    fileType: z.enum(['application/pdf', 'text/plain']),
    fileSize: z.number().lte(1073741824), // 1GB = 1073741824B
});

export type GetSignedUrlPayload = z.infer<typeof GetSignedUrlSchema>;
