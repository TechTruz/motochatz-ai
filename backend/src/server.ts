import app from '@/app.js';
import { connectDb } from '@/configs/database.js';

const PORT = process.env.PORT || '3000';

export const server = app.listen(PORT, async () => {
    await connectDb();
    console.log(`Server is listening on port ${PORT}`);
});
