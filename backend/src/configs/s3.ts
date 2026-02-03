import {
    ListBucketsCommand,
    CreateBucketCommand,
    S3Client,
    type Bucket,
} from '@aws-sdk/client-s3';
import Logger from '@utils/logger.js';

export const s3 = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: process.env.S3_PATH_STYLE === 'PATH' ? true : false,
});

export async function connectS3() {
    try {
        Logger.debug('Connecting to S3...');

        if (
            process.env.NODE_ENV === 'production' &&
            (!process.env.S3_REGION || !process.env.S3_ENDPOINT)
        ) {
            Logger.error(
                'S3_REGION and S3_ENDPOINT is missing from process.env'
            );

            process.exit(1);
        } else if (
            !process.env.S3_ACCESS_KEY_ID ||
            !process.env.S3_SECRET_ACCESS_KEY ||
            !process.env.S3_BUCKET_NAME
        ) {
            Logger.error(
                'S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_BUCKET_NAME is missing from process.env'
            );

            process.exit(1);
        }

        const result = await s3.send(
            new ListBucketsCommand({
                MaxBuckets: 10,
            })
        );

        if (!result.Buckets?.includes(process.env.S3_BUCKET_NAME as Bucket)) {
            await s3.send(
                new CreateBucketCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    ACL: 'public-read',
                })
            );

            Logger.debug('S3 bucker has been successfully created');
        }

        Logger.info('S3 connection established successfully');
    } catch (err) {
        Logger.error('S3 connection error:', err);
    }
}
