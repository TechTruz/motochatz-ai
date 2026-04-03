import app from '@/app.js';
import { connectDb } from '@configs/database.js';
import { connectS3 } from '@configs/s3.js';
import Logger from '@utils/logger.js';

const PORT = process.env.PORT || '3000';

const initServer = async () => {
    await connectDb();
    await connectS3();
    app.listen(PORT, async () => {
        Logger.info(`Server is listening on port ${PORT}`);
    });
};

initServer();
