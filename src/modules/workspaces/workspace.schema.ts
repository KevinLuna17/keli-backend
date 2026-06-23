import { z } from "zod";

export const WorkspaceIdParamsSchema = z.object({
  id: z.uuid(),
});

export type WorkspaceIdParamsDto = z.infer<typeof WorkspaceIdParamsSchema>;

export const CreateWorkspaceBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
});

export type CreateWorkspaceBodyDto = z.infer<typeof CreateWorkspaceBodySchema>;

export const UpdateWorkspaceBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
});

export type UpdateWorkspaceBodyDto = z.infer<typeof UpdateWorkspaceBodySchema>;
