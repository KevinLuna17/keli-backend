import { CategoryRecord, CategoryRow } from "./category.types";

export function mapCategoryRowToRecord(row: CategoryRow): CategoryRecord {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
