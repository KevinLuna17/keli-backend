import { z } from "zod";

export const UpdateProfileBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  imageUrl: z.string().url("Image URL must be a valid URL").optional().nullable(),
});

export type UpdateProfileBodyDto = z.infer<typeof UpdateProfileBodySchema>;
