import app from '@/app.js';
import { connectDb } from '@configs/database.js';
import Logger from '@utils/logger.js';

const PORT = process.env.PORT || '3000';

const initServer = async () => {
    await connectDb();
    app.listen(PORT, async () => {
        Logger.info(`Server is listening on port ${PORT}`);
    });
};

initServer();
