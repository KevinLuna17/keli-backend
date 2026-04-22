import * as z from "zod";

export const syncUserSchema = z.object({
  email: z.string(),
  name: z.string().optional(),
  imageUrl: z.url().optional(),
});