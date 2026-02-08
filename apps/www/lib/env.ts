import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url(),
});

const _env = envSchema.safeParse({
  API_URL: process.env.API_URL,
});

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
