import { pgEnum } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const workspaceTypeEnum = pgEnum("workspace_type", [
  "personal",
  "shared",
]);

export const workspaceMemberRoleEnum = pgEnum("workspace_member_role", [
  "owner",
  "member",
]);

export const workspaceInvitationStatusEnum = pgEnum(
  "workspace_invitation_status",
  ["pending", "accepted", "declined", "expired"],
);
