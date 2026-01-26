import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import routes from '@routes/index.route.js';
import { errorHandler } from '@middlewares/errors.js';
import morganMiddleware from '@configs/morganMiddleware.js';
import NotFoundError from '@errors/NotFoundError.js';

const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const app = express();

app.set('trust proxy', true);
app.disable('x-powered-by');
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/stream')) {
        return next();
    }

    return helmet()(req, res, next);
});
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/stream')) {
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

app.use('/api', routes);
app.use((req: Request, _res: Response, next: NextFunction) => {
    next(
        new NotFoundError({
            message: `The requested URL ${req.originalUrl} was not found on this server`,
        })
    );
});
app.use(errorHandler);

export default app;
