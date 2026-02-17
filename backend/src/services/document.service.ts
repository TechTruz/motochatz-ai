// Workaround for @microsoft/fetch-event-source `document is not defined`
// See: https://github.com/rayjp2010/fetch-event-source/issues/35
if (!globalThis.window) {
    globalThis.window = {
        fetch: globalThis.fetch,
        setTimeout: globalThis.setTimeout,
        clearTimeout: globalThis.clearTimeout,
    };
}

if (!globalThis.document) {
    globalThis.document = { removeEventListener: () => {}, body: {} };
}

import mime from 'mime-types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Types, startSession } from 'mongoose';
import { PassThrough, Readable } from 'stream';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { v4 as uuidv4 } from 'uuid';
import { s3 } from '@configs/s3.js';
import type {
    GetManyDocumentsPayload,
    GetSignedUrlPayload,
    IngestDocumentPayload,
} from '@schemas/document.schema.js';
import Document from '@models/document.js';
import type { DocumentData } from '@/@types/document.js';
import BadGatewayError from '@errors/BadGatewayError.js';
import NotFoundError from '@errors/NotFoundError.js';
import Logger from '@utils/logger.js';

class DocumentService {
    static async getPreSignedUrl(
        payload: GetSignedUrlPayload,
        garageId: string
    ) {
        const fileExtension = mime.extension(payload.fileType) as string;
        const fileName = `${payload.fileName}-${Date.now()}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `documents/${fileName}`,
            ContentType: payload.fileType,
            ContentLength: payload.fileSize,
        });

        let signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 3600,
        });

        const documentUrl = `${process.env.S3_PUBLIC_ENDPOINT ?? process.env.S3_ENDPOINT}/${process.env.S3_PATH_STYLE === 'PATH' ? process.env.S3_BUCKET_NAME.concat('/') : ''}documents/${fileName}`;

        const document = await Document.insertOne({
            garage: garageId,
            fileType: payload.fileType,
            fileName,
            fileSize: payload.fileSize,
            status: 'UPLOADING',
            documentUrl,
        });

        if (process.env.S3_PUBLIC_ENDPOINT) {
            const pattern = /^http[s]?:\/\/[^/]+/;

            signedUrl = signedUrl.replace(
                pattern,
                process.env.S3_PUBLIC_ENDPOINT
            );
        }

        return {
            documentId: document._id,
            documentUrl,
            signedUrl,
        };
    }

    static async getManyDocuments(payload: GetManyDocumentsPayload) {
        const session = await startSession();

        const { documents, totalDocuments } = await session.withTransaction(
            async () => {
                const filters = {
                    garage: new Types.ObjectId(payload.garageId),
                    ...(payload.status !== 'ALL' && { status: payload.status }),
                };

                const documents: DocumentData[] = await Document.aggregate()
                    .match(filters)
                    .addFields({
                        documentId: '$_id',
                    })
                    .project({
                        _id: 0,
                        __v: 0,
                        garage: 0,
                    })
                    .sort({
                        [payload.sort.includes('documentId')
                            ? '_id'
                            : payload.sort.includes('-')
                              ? (payload.sort.split('-')[1] as string)
                              : (payload.sort as string)]:
                            payload.sort.includes('-') ? 'desc' : 'asc',
                    })
                    .skip(payload.limit * (payload.page - 1))
                    .limit(payload.limit)
                    .exec();

                const totalDocuments =
                    await Document.find(filters).countDocuments();

                return {
                    documents,
                    totalDocuments,
                };
            }
        );

        return {
            documents,
            total: totalDocuments,
        };
    }

    static ingestDocument(
        payload: IngestDocumentPayload,
        signal?: AbortSignal
    ): Readable {
        const passThrough = new PassThrough();

        (async () => {
            try {
                const processingMsgId = uuidv4();
                const data = {
                    status: 'PROCESSING',
                    timestamp: new Date().toISOString(),
                };

                passThrough.write(`id: ${processingMsgId}\n`);
                passThrough.write(`event: status\n`);
                passThrough.write(`data: ${JSON.stringify(data)}\n\n`);

                const document = await Document.findOneAndUpdate(
                    {
                        _id: new Types.ObjectId(payload.documentId),
                        status: {
                            $in: ['UPLOADING', 'UPLOADED'],
                        },
                    },
                    {
                        status: 'UPLOADED',
                    },
                    {
                        returnDocument: 'after',
                    }
                );

                if (!document) {
                    passThrough.destroy(
                        new NotFoundError({
                            message: 'Document does not exist',
                        })
                    );

                    return;
                }

                const requestBody = {
                    documentId: document._id.toString(),
                    documentUrl: document.documentUrl,
                };

                await fetchEventSource(`${process.env.AI_SERVER_URL}/ingest`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': process.env.AI_API_KEY,
                    },
                    body: JSON.stringify(requestBody),
                    signal: signal ?? null,
                    openWhenHidden: true,
                    onopen: async (response) => {
                        if (!response.ok) {
                            const errorBody = await response.text();

                            Logger.error(
                                `AI server responded with ${response.status} ${response.statusText}: ${errorBody}`
                            );

                            passThrough.destroy(
                                new BadGatewayError({
                                    message:
                                        'There is a problem with upstream AI server',
                                })
                            );
                        }
                    },
                    onmessage: (msg) => {
                        if (msg.event === 'status') {
                            const statusUpdate = JSON.parse(msg.data);

                            if (statusUpdate.status === 'INDEXED') {
                                Document.findOneAndUpdate(
                                    {
                                        _id: new Types.ObjectId(
                                            payload.documentId
                                        ),
                                    },
                                    {
                                        $set: {
                                            status: 'INDEXED',
                                        },
                                    },
                                    {
                                        returnDocument: 'after',
                                    }
                                ).then((doc) => {
                                    if (!doc) {
                                        throw new NotFoundError({
                                            message: 'Document does not exist',
                                        });
                                    }
                                });
                            }
                        }

                        let sseString = '';
                        if (msg.id) {
                            sseString += `id: ${msg.id}\n`;
                        }

                        if (msg.event) {
                            sseString += `event: ${msg.event}\n`;
                        }

                        sseString += `data: ${msg.data}\n\n`;
                        passThrough.write(sseString);
                    },
                    onclose: () => {
                        passThrough.end();
                    },
                    onerror: (err) => {
                        if (err instanceof TypeError) {
                            const badGatewayError = new BadGatewayError({
                                message:
                                    'There is a problem with upstream AI server',
                            });

                            passThrough.destroy(badGatewayError);
                            throw badGatewayError;
                        }

                        passThrough.destroy(err);
                        throw err;
                    },
                });
            } catch (error) {
                passThrough.destroy(error as Error);
            }
        })();

        return passThrough;
    }
}

export default DocumentService;
