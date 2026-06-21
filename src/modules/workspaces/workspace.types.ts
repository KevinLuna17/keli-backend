import { workspacesTable } from "../../db/schema/workspaces-schema";

export type WorkspaceRow = typeof workspacesTable.$inferSelect;

export type WorkspaceRecord = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date | null;
};
