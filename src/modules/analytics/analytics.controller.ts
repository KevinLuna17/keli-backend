import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import { DashboardQuerySchema } from "./analytics.schema";
import * as analyticsService from "./analytics.service";
import { WorkspaceDashboard } from "./analytics.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(DashboardQuerySchema, req.query);

    const dashboard = await analyticsService.getWorkspaceDashboard(
      userId,
      query,
    );

    const response: ApiSuccessResponse<WorkspaceDashboard> = {
      data: dashboard,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
