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
app.use(helmet());
app.use(compression());
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

app.use((req: Request, _res: Response, next: NextFunction) => {
    next(
        new NotFoundError({
            message: `The requested URL ${req.originalUrl} was not found on this server`,
        })
    );
});
app.use(errorHandler);

export default app;
