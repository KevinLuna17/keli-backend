import { WorkspaceRecord, WorkspaceRow } from "./workspace.types";

export function mapWorkspaceRowToRecord(row: WorkspaceRow): WorkspaceRecord {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    ownerId: row.ownerId,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
