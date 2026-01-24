import mongoose from 'mongoose';
import Logger from '@utils/logger.js';

const DATABASE_URI = process.env.DATABASE_URI;

mongoose.connection.on('connecting', () =>
    Logger.debug('Connecting to the database...')
);
mongoose.connection.on('connected', () =>
    Logger.info('Database connection established successfully')
);
mongoose.connection.on('open', () =>
    Logger.debug('Database connection opened')
);
mongoose.connection.on('disconnecting', () =>
    Logger.debug('Disconnecting from the database...')
);
mongoose.connection.on('disconnected', () =>
    Logger.info('Database disconnected')
);
mongoose.connection.on('close', () =>
    Logger.debug('Database connection closed')
);
mongoose.connection.on('reconnected', () =>
    Logger.debug('Reconnecting to the database...')
);
mongoose.connection.on('error', (err) =>
    Logger.error('Database connection error:', err)
);

export const connectDb = async () => {
    try {
        await mongoose.connect(DATABASE_URI);
    } catch (err) {
        Logger.error('Database initial connection error:', err);
    }
};
