import { z } from "zod";

export const WorkspaceMemberParamsSchema = z.object({
  id: z.uuid(),
  memberId: z.uuid(),
});

export type WorkspaceMemberParamsDto = z.infer<
  typeof WorkspaceMemberParamsSchema
>;

export const ListWorkspaceMembersParamsSchema = z.object({
  id: z.uuid(),
});

export type ListWorkspaceMembersParamsDto = z.infer<
  typeof ListWorkspaceMembersParamsSchema
>;
