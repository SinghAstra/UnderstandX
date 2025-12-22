import { env } from "@/config/env";
import { errorHandler } from "@/middleware/error.middleware";
import { AppError } from "@/utils/AppError";
import { logError } from "@/utils/logger";
import { sendSuccess } from "@/utils/response";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

const app = express();

// --- 1. Global Middleware ---
app.use(express.json());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// --- 2. Routes ---

/**
 * Health Check Route
 * Uses sendSuccess to maintain the { success: true, ... } structure
 */
app.get("/", (req: Request, res: Response) => {
  return sendSuccess(res, { environment: env.NODE_ENV }, "Server is healthy");
});

/**
 * Example Error Route
 * The errorHandler middleware will format this as { success: false, ... }
 */
app.get("/test-error", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(400, "This is a test bad request error"));
});

// --- 3. 404 Handler ---
app.all("*path", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// --- 4. Global Error Middleware ---
// Processes all errors and sends the standardized ApiResponse
app.use(errorHandler);

// --- 5. Start Server ---
const server = app.listen(env.PORT, () => {
  console.log(`
  🚀 API Server is running!
  ---------------------------------
  Port:        ${env.PORT}
  Environment: ${env.NODE_ENV}
  Frontend:    ${env.FRONTEND_URL}
  ---------------------------------
  `);
});

/**
 * Global Unhandled Rejection Handler
 * Catches async errors outside of express routes
 */
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logError(err);

  // Graceful shutdown: close server before exiting
  server.close(() => {
    process.exit(1);
  });
});
