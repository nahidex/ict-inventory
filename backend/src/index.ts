import app from "./app";
import { config } from "./config";
import prisma from "./config/db";

// Check DB connection and Start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("[database]: Database connected successfully");
    
    app.listen(config.port, () => {
      console.log(`[server]: Server is running at http://localhost:${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error("[database]: Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
