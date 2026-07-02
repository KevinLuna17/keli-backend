import {
  WorkspaceMemberRecord,
  WorkspaceMemberResponse,
  WorkspaceMemberRow,
  WorkspaceMemberWithUserRecord,
} from "./workspace-member.types";

export function mapWorkspaceMemberRowToRecord(
  row: WorkspaceMemberRow,
): WorkspaceMemberRecord {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    userId: row.userId,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapWorkspaceMemberWithUserRow(
  row: WorkspaceMemberRow & {
    name: string | null;
    email: string;
    imageUrl: string | null;
  },
): WorkspaceMemberWithUserRecord {
  return {
    ...mapWorkspaceMemberRowToRecord(row),
    name: row.name,
    email: row.email,
    imageUrl: row.imageUrl,
  };
}

export function mapWorkspaceMemberToResponse(
  member: WorkspaceMemberWithUserRecord,
): WorkspaceMemberResponse {
  return {
    id: member.id,
    userId: member.userId,
    name: member.name,
    email: member.email,
    imageUrl: member.imageUrl,
    role: member.role,
  };
}
