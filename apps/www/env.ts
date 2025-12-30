import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  API_URL: z.url(),
  JWT_SECRET: z.string().min(1),
  NEXT_AUTH_SECRET: z.string().min(1),

  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SOCKET_URL: z.string().url(),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

// Validate process.env against the schema
const _env = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  API_URL: process.env.API_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
