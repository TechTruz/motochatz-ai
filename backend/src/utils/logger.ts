import winston from 'winston';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const NODE_ENV = process.env.NODE_ENV || 'development';

    return NODE_ENV === 'development' ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf((info) => {
        return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
);

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({
                all: true,
            })
        ),
    }),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({
        filename: 'logs/all.log',
    }),
];

const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

export default Logger;
