import { env } from "@/config/env";
import Redis from "ioredis";

// Create a new Redis connection.
// The connection details are automatically sourced from the environment variables.
export const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// The Publishing client (for Socket.io Adapter)
export const pubClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// The Subscribing client (for Socket.io Adapter and Log Listeners)
// This client enters 'subscriber mode' and cannot run regular commands
export const subClient = pubClient.duplicate();

pubClient.on("error", (err) => console.error("Redis Pub Error", err));
subClient.on("error", (err) => console.error("Redis Sub Error", err));
