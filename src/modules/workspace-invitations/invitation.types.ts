import { workspaceInvitationsTable } from "../../db/schema/workspace-invitations-schema";
import { workspaceInvitationStatusEnum } from "../../db/schema/enums";

export type InvitationStatus =
  (typeof workspaceInvitationStatusEnum.enumValues)[number];

export type InvitationRow = typeof workspaceInvitationsTable.$inferSelect;

export type InvitationRecord = {
  id: string;
  workspaceId: string;
  invitedEmail: string;
  invitedByUserId: string;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date | null;
};

export type InvitationWithWorkspaceRecord = InvitationRecord & {
  workspaceName: string;
  workspaceType: "personal" | "shared";
  invitedByName: string | null;
};

export type CreateInvitationInput = {
  workspaceId: string;
  invitedEmail: string;
  invitedByUserId: string;
  expiresAt: Date;
};

export type InvitationResponse = {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceType: "personal" | "shared";
  invitedEmail: string;
  invitedByUserId: string;
  invitedByName: string | null;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date | null;
};
