import { AppError } from "../../shared/errors/app-error";
import * as workspaceService from "../workspaces/workspace.service";
import * as categoriesRepository from "./categories.repository";
import { CategoryRecord } from "./category.types";
import { ListCategoriesQueryDto } from "./category.schema";

export async function listWorkspaceCategories(
  userId: string,
  query: ListCategoriesQueryDto,
): Promise<CategoryRecord[]> {
  await workspaceService.assertWorkspaceAccess(userId, query.workspaceId);

  return categoriesRepository.listByWorkspaceId(query.workspaceId);
}
