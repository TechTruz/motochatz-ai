import mongoose from 'mongoose';

const DATABASE_URI =
    process.env.DATABASE_URI || 'mongodb://localhost:27017/motochatz';

export const connectDb = async () => {
    try {
        await mongoose.connect(DATABASE_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB Error: ', err);
    }
};
