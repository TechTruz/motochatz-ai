import mongoose from 'mongoose';
import Logger from '@utils/logger.js';

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
    const uri = process.env.DATABASE_URI;

    if (!uri) {
        Logger.error('DATABASE_URI is missing from process.env');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
    } catch (err) {
        Logger.error('Database initial connection error:', err);
    }
};
