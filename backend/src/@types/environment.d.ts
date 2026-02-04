import type { JwtClaim } from './jwt.js';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development' | 'test' | 'release' | 'production';
            PORT?: string;
            CORS_ORIGIN?: string;
            DATABASE_URI: string;
            JWT_SECRET: string;
            S3_REGION?: string;
            S3_ENDPOINT?: string;
            S3_PUBLIC_ENDPOINT?: string;
            S3_ACCESS_KEY_ID: string;
            S3_SECRET_ACCESS_KEY: string;
            S3_BUCKET_NAME: string;
            S3_PATH_STYLE: 'PATH' | 'VIRTUAL';
        }
    }

    namespace Express {
        interface Request {
            refreshTokenId?: string;
            userId?: string | undefined;
            accessToken?: string;
            tokenPayload?: JwtClaim;
        }
    }
}

export {};
