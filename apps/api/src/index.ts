import { env } from "@/config/env";
import { errorHandler } from "@/middleware/error.middleware";
import repoRoutes from "@/routes/repo.routes";
import { AppError } from "@/utils/AppError";
import { logError } from "@/utils/logger";
import { sendSuccess } from "@/utils/response";
import { createAdapter } from "@socket.io/redis-adapter";
import { prisma } from "@understand-x/database";
import { REDIS_CHANNELS, SOCKET_EVENTS } from "@understand-x/shared";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { pubClient, subClient } from "./config/redis";

const app = express();
const httpServer = createServer(app);

// --- Initialize Socket.io ---
const io = new Server(httpServer, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});

// Connect Socket.io to Redis (allows Worker to communicate with Sockets)
io.adapter(createAdapter(pubClient, subClient));

// Tell Redis to listen to this channel
subClient.subscribe(REDIS_CHANNELS.REPO_LOG_PUBLISH, (err, count) => {
  if (err) {
    console.error("Failed to subscribe to Redis channel:", err.message);
  } else {
    console.log(
      `Subscribed to ${count} Redis channel(s). Listening for logs...`
    );
  }
});

// Define the listener to handle the actual message
subClient.on("message", async (channel, message) => {
  // Only process if it's the specific channel we want
  if (channel === REDIS_CHANNELS.REPO_LOG_PUBLISH) {
    try {
      const { repoId, logId } = JSON.parse(message);

      // Reference-based fetch
      const fullLog = await prisma.log.findUnique({
        where: { id: logId },
      });

      console.log("Log to be broadcasted : ", fullLog);

      if (fullLog) {
        // Broadcast to specific room
        io.to(`repo_${repoId}`).emit(SOCKET_EVENTS.LOG_UPDATED, fullLog);
      }
    } catch (error) {
      console.error("Error processing Redis Pub/Sub message:", error);
    }
  }
});
// Socket Connection Handler
io.on("connection", (socket) => {
  const repoId = socket.handshake.query.repoId as string;
  if (repoId) {
    socket.join(`repo_${repoId}`);
    console.log(`[SOCKET]: Client joined room repo_${repoId}`);
  }

  socket.on("disconnect", () => {
    console.log("[SOCKET]: Client disconnected");
  });
});

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

app.use("/api/repos", repoRoutes);

// --- 3. 404 Handler ---
app.all("*path", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// --- 4. Global Error Middleware ---
// Processes all errors and sends the standardized ApiResponse
app.use(errorHandler);

// --- Start HTTP Server ---
httpServer.listen(env.PORT, () => {
  console.log(`🚀 API Server + WebSockets running on Port: ${env.PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  logError(err);
  httpServer.close(() => process.exit(1));
});
/**
 * Global Unhandled Rejection Handler
 * Catches async errors outside of express routes
 */
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logError(err);

  // Graceful shutdown: close server before exiting
  httpServer.close(() => {
    process.exit(1);
  });
});
