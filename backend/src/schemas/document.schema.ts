import * as z from 'zod';

export const GetSignedUrlSchema = z.strictObject({
    fileName: z
        .string()
        .regex(/^[\w\-. ]+$/, {
            error: "fileName only allow alphanumerics, dots '.', underscores '_', dashes '-', or whitespaces ' '",
        })
        .max(200),
    fileType: z.enum(['application/pdf', 'text/plain']),
    fileSize: z
        .string()
        .transform((val) => parseInt(val))
        .pipe(z.number().lte(1073741824)), // 1073741824 B = 1 GB
});

export const GetManyDocumentsSchema = z.strictObject({
    garageId: z.hex().length(24),
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
    status: z.enum(['ALL', 'UPLOADING', 'UPLOADED', 'INDEXED']).default('ALL'),
    sort: z
        .enum([
            'documentId',
            '-documentId',
            'fileSize',
            '-fileSize',
            'createdAt',
            '-createdAt',
            'updatedAt',
            '-updatedAt',
        ])
        .default('documentId'),
});

export const IngestDocumentSchema = z.strictObject({
    documentId: z.hex().length(24),
});

export type GetSignedUrlPayload = z.infer<typeof GetSignedUrlSchema>;
export type GetManyDocumentsPayload = z.infer<typeof GetManyDocumentsSchema>;
export type IngestDocumentPayload = z.infer<typeof IngestDocumentSchema>;
