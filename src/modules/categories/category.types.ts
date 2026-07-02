import { categoriesTable } from "../../db/schema/categories-schema";
import { CategoryIconKey } from "../../shared/constants/category-icon-keys";

export type CategoryType = "income" | "expense";

export type CategoryRow = typeof categoriesTable.$inferSelect;

export type CategoryRecord = {
  id: string;
  workspaceId: string;
  name: string;
  type: CategoryType;
  iconKey: CategoryIconKey;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateCategoryInput = {
  workspaceId: string;
  name: string;
  type: CategoryType;
  iconKey?: CategoryIconKey;
};
