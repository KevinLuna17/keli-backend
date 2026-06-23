import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import * as workspaceService from "./workspace.service";
import { CurrentWorkspaceResponse } from "./workspace.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function getCurrentWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const workspace = await workspaceService.getCurrentWorkspace(userId);

    const response: ApiSuccessResponse<CurrentWorkspaceResponse> = {
      data: workspace,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
