import express, { type Request, type Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errors.js';

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(
    cors({
        origin:
            process.env.NODE_ENV !== 'production'
                ? '*'
                : CORS_ORIGIN.split(','),
        credentials: true,
    })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('Hello, World!');
});
app.use(errorHandler);

export default app;
