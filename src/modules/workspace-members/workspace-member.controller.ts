import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import {
  ListWorkspaceMembersParamsSchema,
  WorkspaceMemberParamsSchema,
} from "./workspace-member.schema";
import * as workspaceMemberService from "./workspace-member.service";
import { WorkspaceMemberResponse } from "./workspace-member.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function listWorkspaceMembers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(ListWorkspaceMembersParamsSchema, req.params);
    const members = await workspaceMemberService.listWorkspaceMembers(
      userId,
      params.id,
    );

    const response: ApiSuccessResponse<WorkspaceMemberResponse[]> = {
      data: members,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function removeWorkspaceMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(WorkspaceMemberParamsSchema, req.params);

    await workspaceMemberService.removeWorkspaceMember(
      userId,
      params.id,
      params.memberId,
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
