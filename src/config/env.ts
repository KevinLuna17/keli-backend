import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CLERK_SECRET_KEY: z
    .string()
    .min(1, "CLERK_SECRET_KEY is required")
    .refine((value) => value.startsWith("sk_"), {
      message:
        "CLERK_SECRET_KEY must start with sk_ (not the publishable pk_ key)",
    }),
  CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "CLERK_PUBLISHABLE_KEY is required")
    .refine((value) => value.startsWith("pk_"), {
      message: "CLERK_PUBLISHABLE_KEY must start with pk_",
    }),
  CORS_ORIGINS: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment variables:\n${formatted}`);
  }

  return result.data;
}

export const env = parseEnv();

export function getCorsOrigins(): string[] | true {
  if (!env.CORS_ORIGINS || env.CORS_ORIGINS === "*") {
    return true;
  }

  return env.CORS_ORIGINS.split(",").map((origin) => origin.trim());
}
