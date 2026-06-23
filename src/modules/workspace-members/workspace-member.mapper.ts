import { WorkspaceMemberRecord, WorkspaceMemberRow } from "./workspace-member.types";

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
