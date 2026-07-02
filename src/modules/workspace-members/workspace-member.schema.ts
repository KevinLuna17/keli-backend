import { z } from "zod";

export const WorkspaceMemberParamsSchema = z
  .object({
    id: z.uuid("id must be a valid UUID"),
    memberId: z.uuid("memberId must be a valid UUID"),
  })
  .strict();

export type WorkspaceMemberParamsDto = z.infer<
  typeof WorkspaceMemberParamsSchema
>;

export const ListWorkspaceMembersParamsSchema = z
  .object({
    id: z.uuid("id must be a valid UUID"),
  })
  .strict();

export type ListWorkspaceMembersParamsDto = z.infer<
  typeof ListWorkspaceMembersParamsSchema
>;
