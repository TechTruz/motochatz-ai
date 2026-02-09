import mime from 'mime-types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Types, startSession } from 'mongoose';
import { s3 } from '@configs/s3.js';
import type {
    GetManyDocumentsPayload,
    GetSignedUrlPayload,
} from '@schemas/document.schema.js';
import Document from '@models/document.js';
import type { DocumentData } from '@/@types/document.js';

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
}

export default DocumentService;
