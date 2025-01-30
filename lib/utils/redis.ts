import { Redis } from '@upstash/redis';

console.log("process.env.UPSTASH_REDIS_REST_URL is ",process.env.UPSTASH_REDIS_REST_URL)
console.log("process.env.UPSTASH_REDIS_REST_TOKEN is ",process.env.UPSTASH_REDIS_REST_TOKEN)

// Initialize Redis using credentials from environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default redis;