import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import * as workspaceService from "./workspace.service";
import {
  CreateWorkspaceBodySchema,
  UpdateWorkspaceBodySchema,
  UpdateWorkspaceCurrencyBodySchema,
  WorkspaceIdParamsSchema,
} from "./workspace.schema";
import {
  CurrentWorkspaceResponse,
  WorkspaceResponse,
} from "./workspace.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function listWorkspaces(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const workspaces = await workspaceService.listWorkspaces(userId);

    const response: ApiSuccessResponse<WorkspaceResponse[]> = {
      data: workspaces,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
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

export async function createWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const body = parseSchema(CreateWorkspaceBodySchema, req.body);
    const workspace = await workspaceService.createSharedWorkspace(userId, body);

    const response: ApiSuccessResponse<WorkspaceResponse> = {
      data: workspace,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(WorkspaceIdParamsSchema, req.params);
    const body = parseSchema(UpdateWorkspaceBodySchema, req.body);
    const workspace = await workspaceService.updateWorkspace(
      userId,
      params.id,
      body,
    );

    const response: ApiSuccessResponse<WorkspaceResponse> = {
      data: workspace,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateWorkspaceCurrency(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(WorkspaceIdParamsSchema, req.params);
    const body = parseSchema(UpdateWorkspaceCurrencyBodySchema, req.body);
    const workspace = await workspaceService.updateWorkspaceCurrency(
      userId,
      params.id,
      body,
    );

    const response: ApiSuccessResponse<WorkspaceResponse> = {
      data: workspace,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function deleteWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(WorkspaceIdParamsSchema, req.params);

    await workspaceService.deleteWorkspace(userId, params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
