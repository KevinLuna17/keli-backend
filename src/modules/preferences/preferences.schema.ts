import { z } from "zod";

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;

export const PatchPreferencesBodySchema = z.object({
  language: z.enum(SUPPORTED_LANGUAGES),
});

export type PatchPreferencesBodyDto = z.infer<typeof PatchPreferencesBodySchema>;
