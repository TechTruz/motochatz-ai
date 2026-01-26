declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development' | 'test' | 'release' | 'production';
            PORT?: string;
            CORS_ORIGIN?: string;
            DATABASE_URI: string;
            JWT_SECRET: string;
        }
    }
}

export {};
