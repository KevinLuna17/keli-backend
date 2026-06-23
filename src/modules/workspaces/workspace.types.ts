import { workspacesTable } from "../../db/schema/workspaces-schema";

export type WorkspaceType = "personal" | "shared";

export type WorkspaceRow = typeof workspacesTable.$inferSelect;

export type WorkspaceRecord = {
  id: string;
  name: string;
  type: WorkspaceType;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateWorkspaceInput = {
  name: string;
  type: WorkspaceType;
  ownerId: string;
};

export type CurrentWorkspaceResponse = {
  id: string;
  name: string;
  type: WorkspaceType;
  role: "owner" | "member";
};

export type WorkspaceResponse = {
  id: string;
  name: string;
  type: WorkspaceType;
  ownerId: string;
  role: "owner" | "member";
  createdAt: Date;
  updatedAt: Date | null;
};

export type WorkspaceWithMembership = {
  workspace: WorkspaceRecord;
  role: "owner" | "member";
};
