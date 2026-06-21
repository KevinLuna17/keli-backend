import { categoriesTable } from "../../db/schema/categories-schema";

export type CategoryRow = typeof categoriesTable.$inferSelect;

export type CategoryRecord = {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
};
