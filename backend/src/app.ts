import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import assetRoutes from "./routes/asset.routes";
import categoryRoutes from "./routes/category.routes";
import branchRoutes from "./routes/branch.routes";
import officerRoutes from "./routes/officer.routes";
import assignmentRoutes from "./routes/assignment.routes";
import maintenanceRoutes from "./routes/maintenance.routes";
import nocRoutes from "./routes/noc.routes";
import activityLogRoutes from "./routes/activity-log.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";

const app: Express = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: "*",
  credentials: true
}));
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "..", "..", "uploads")));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/noc", nocRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// Base route
app.get("/", (req: Request, res: Response) => {
  res.send("Asset Lifecycle API Server is running");
});

export default app;
