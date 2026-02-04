import mime from 'mime-types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@configs/s3.js';
import type { GetSignedUrlPayload } from '@schemas/document.schema.js';
import Document from '@models/document.js';

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
        });

        let signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 3600,
        });

        const documentUrl = `${process.env.S3_PUBLIC_ENDPOINT ?? process.env.S3_ENDPOINT}/${process.env.S3_PATH_STYLE === 'PATH' ? process.env.S3_BUCKET_NAME.concat('/') : ''}documents/${fileName}`;

        const document = await Document.insertOne({
            garage: garageId,
            fileMIME: payload.fileType,
            fileName,
            fileSize: payload.fileSize,
            status: 'UPLOADING',
            documentUrl,
        });

        if (process.env.S3_PUBLIC_ENDPOINT) {
            const pattern = /^http[s]?:\/\/[^\/]+/;
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
}

export default DocumentService;
