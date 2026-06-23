import { WorkspaceMemberRole } from "../workspace-members/workspace-member.types";
import {
  WorkspaceRecord,
  WorkspaceResponse,
  WorkspaceRow,
} from "./workspace.types";

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

export function mapWorkspaceToResponse(
  workspace: WorkspaceRecord,
  role: WorkspaceMemberRole,
): WorkspaceResponse {
  return {
    id: workspace.id,
    name: workspace.name,
    type: workspace.type,
    ownerId: workspace.ownerId,
    role,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
}
