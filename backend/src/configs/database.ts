import mongoose from 'mongoose';
import Logger from '@utils/logger.js';

const DATABASE_URI = process.env.DATABASE_URI;

export const connectDb = async () => {
    try {
        await mongoose.connect(DATABASE_URI);
        Logger.debug('Connected to MongoDB');
    } catch (err) {
        Logger.error('MongoDB Error: ', err);
    }
};
