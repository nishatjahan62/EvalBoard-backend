import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(4000),

  FRONTEND_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("15m"),
});

export const env = envSchema.parse(process.env);

export type AppEnv = z.infer<typeof envSchema>;