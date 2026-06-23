import { workspaceMembersTable } from "../../db/schema/workspace-members-schema";
import { workspaceMemberRoleEnum } from "../../db/schema/enums";

export type WorkspaceMemberRole =
  (typeof workspaceMemberRoleEnum.enumValues)[number];

export type WorkspaceMemberRow = typeof workspaceMembersTable.$inferSelect;

export type WorkspaceMemberRecord = {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateWorkspaceMemberInput = {
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
};
