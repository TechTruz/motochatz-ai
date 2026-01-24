import morgan, { type StreamOptions } from 'morgan';
import split from 'split';
import Logger from '@utils/logger.js';

const stream: StreamOptions = split().on('data', (line) => {
    Logger.http(line);
});

const skip = () => {
    const NODE_ENV = process.env.NODE_ENV || 'development';

    return NODE_ENV !== 'development';
};

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] -  :response-time ms',
    {
        stream,
        skip,
    }
);

export default morganMiddleware;
