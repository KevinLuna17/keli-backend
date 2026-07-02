import { z } from "zod";

export const WorkspaceInvitationParamsSchema = z.object({
  id: z.uuid(),
});

export type WorkspaceInvitationParamsDto = z.infer<
  typeof WorkspaceInvitationParamsSchema
>;

export const CreateWorkspaceInvitationBodySchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type CreateWorkspaceInvitationBodyDto = z.infer<
  typeof CreateWorkspaceInvitationBodySchema
>;

export const InvitationIdParamsSchema = z.object({
  id: z.uuid(),
});

export type InvitationIdParamsDto = z.infer<typeof InvitationIdParamsSchema>;
