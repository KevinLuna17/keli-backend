import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { db } from "./db";

const PORT = env.PORT;

const startServer = async () => {
  try {
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
