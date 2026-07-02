import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import { ListCategoriesQuerySchema } from "./category.schema";
import * as categoryService from "./category.service";
import { CategoryRecord } from "./category.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function listCategories(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(ListCategoriesQuerySchema, req.query);
    const categories = await categoryService.listWorkspaceCategories(
      userId,
      query,
    );

    const response: ApiSuccessResponse<CategoryRecord[]> = {
      data: categories,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
