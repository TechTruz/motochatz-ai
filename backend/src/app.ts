import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { errorHandler } from '@middlewares/errors.js';
import Logger from '@utils/logger.js';
import morganMiddleware from '@configs/morganMiddleware.js';
import NotFoundError from '@errors/NotFoundError.js';

const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/events/stream') {
        return next();
    }

    return helmet()(req, res, next);
});

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/events/stream') {
        return next();
    }

    return compression()(req, res, next);
});
app.use(
    cors({
        origin: NODE_ENV !== 'production' ? '*' : CORS_ORIGIN.split(','),
        credentials: true,
    })
);
app.use(morganMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('Hello, World!');
});
app.get('/logger', (_req: Request, res: Response) => {
    Logger.error('This is an error log');
    Logger.warn('This is an warn log');
    Logger.info('This is an info log');
    Logger.http('This is an http log');
    Logger.debug('This is an debug log');

    res.status(200).send('Hello, World!');
});
app.get('/internal-server-error', (_req: Request, _res: Response) => {
    throw Error('500 internal server error!');
});
app.get('/events/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.flushHeaders();

    const messageInterval = setInterval(() => {
        const id = crypto.randomUUID();
        const message = ['server', 'sent', 'events'][
            Math.floor(Math.random() * 3)
        ];

        res.write(`event: message\n`);
        res.write(`id: ${id}\n`);
        res.write(`data: ${message}\n\n`);
    }, 500);

    const statusInterval = setInterval(() => {
        const id = crypto.randomUUID();
        const status = [
            'INGESTING',
            'CHUNKING',
            'EMBEDDING',
            'INDEXING',
            'INDEXED',
        ][Math.floor(Math.random() * 5)];
        const data = {
            status,
            timestamp: new Date().toISOString(),
        };

        res.write(`event: status\n`);
        res.write(`id: ${id}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 1500);

    req.on('close', () => {
        clearInterval(messageInterval);
        clearInterval(statusInterval);
        res.end();
    });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
    next(
        new NotFoundError({
            message: `The requested URL ${req.originalUrl} was not found on this server`,
        })
    );
});
app.use(errorHandler);

export default app;
