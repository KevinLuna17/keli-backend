import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "../../shared/constants/supported-currencies";

export const WorkspaceIdParamsSchema = z
  .object({
    id: z.uuid("id must be a valid UUID"),
  })
  .strict();

export type WorkspaceIdParamsDto = z.infer<typeof WorkspaceIdParamsSchema>;

export const CreateWorkspaceBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    currency: z.enum(SUPPORTED_CURRENCIES),
  })
  .strict();

export type CreateWorkspaceBodyDto = z.infer<typeof CreateWorkspaceBodySchema>;

export const UpdateWorkspaceBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
  })
  .strict();

export type UpdateWorkspaceBodyDto = z.infer<typeof UpdateWorkspaceBodySchema>;

export const UpdateWorkspaceCurrencyBodySchema = z
  .object({
    currency: z.enum(SUPPORTED_CURRENCIES),
  })
  .strict();

export type UpdateWorkspaceCurrencyBodyDto = z.infer<
  typeof UpdateWorkspaceCurrencyBodySchema
>;
