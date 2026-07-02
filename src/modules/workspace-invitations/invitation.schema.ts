import { z } from "zod";

export const WorkspaceInvitationParamsSchema = z
  .object({
    id: z.uuid("id must be a valid UUID"),
  })
  .strict();

export type WorkspaceInvitationParamsDto = z.infer<
  typeof WorkspaceInvitationParamsSchema
>;

export const CreateWorkspaceInvitationBodySchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address"),
  })
  .strict();

export type CreateWorkspaceInvitationBodyDto = z.infer<
  typeof CreateWorkspaceInvitationBodySchema
>;

export const InvitationIdParamsSchema = z
  .object({
    id: z.uuid("id must be a valid UUID"),
  })
  .strict();

export type InvitationIdParamsDto = z.infer<typeof InvitationIdParamsSchema>;
