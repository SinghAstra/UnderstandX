import dotenv from "dotenv";
import { z } from "zod";

// 1. Load the .env file
dotenv.config();

// 2. Define the schema for your environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default(5000),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
});

// 3. Validate process.env against the schema
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  // Crash the process immediately if variables are missing
  process.exit(1);
}

// 4. Export the validated data
export const env = _env.data;
