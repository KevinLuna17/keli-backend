import app from './app';
import 'dotenv/config';
import { db } from './db';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test DB connection
        await db.execute(`SELECT 1`);
        console.log("DB connection successful");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

startServer();