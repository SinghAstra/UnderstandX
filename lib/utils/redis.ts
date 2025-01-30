import { Redis } from "ioredis";

interface RedisConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  url?: string;
}

class RedisClient {
  private static instance: Redis | null = null;

  private static getConfig(): RedisConfig {
    return { url: process.env.UPSTASH_REDIS_REST_URL };
  }

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      const config = this.getConfig();
      RedisClient.instance = new Redis(config);

      // Error handling
      RedisClient.instance.on("error", (error) => {
        console.log("Redis connection error:", error);
      });
    }

    return RedisClient.instance;
  }
}

// Export a singleton instance
export const redis = RedisClient.getInstance();
