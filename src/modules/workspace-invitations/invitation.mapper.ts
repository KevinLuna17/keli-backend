import {
  InvitationRecord,
  InvitationRow,
  InvitationWithWorkspaceRecord,
} from "./invitation.types";

export function mapInvitationRowToRecord(row: InvitationRow): InvitationRecord {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    invitedEmail: row.invitedEmail,
    invitedByUserId: row.invitedByUserId,
    status: row.status,
    expiresAt: row.expiresAt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapInvitationWithWorkspaceRecord(
  invitation: InvitationRecord,
  workspaceName: string,
  workspaceType: "personal" | "shared",
  invitedByName: string | null,
): InvitationWithWorkspaceRecord {
  return {
    ...invitation,
    workspaceName,
    workspaceType,
    invitedByName,
  };
}
