import { env } from "@/config/env";
import Redis from "ioredis";

// Create a new Redis connection.
// The connection details are automatically sourced from the environment variables.
const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Export the connection to be used by BullMQ and other parts of the application.
export default redisConnection;
