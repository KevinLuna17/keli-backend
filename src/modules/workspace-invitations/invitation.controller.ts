import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import {
  CreateWorkspaceInvitationBodySchema,
  InvitationIdParamsSchema,
  WorkspaceInvitationParamsSchema,
} from "./invitation.schema";
import * as invitationService from "./invitation.service";
import { InvitationResponse } from "./invitation.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function createWorkspaceInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(WorkspaceInvitationParamsSchema, req.params);
    const body = parseSchema(CreateWorkspaceInvitationBodySchema, req.body);
    const invitation = await invitationService.createWorkspaceInvitation(
      userId,
      params.id,
      body,
    );

    const response: ApiSuccessResponse<InvitationResponse> = {
      data: invitation,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function listInvitations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const invitations = await invitationService.listPendingInvitationsForUser(
      userId,
    );

    const response: ApiSuccessResponse<InvitationResponse[]> = {
      data: invitations,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function acceptInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(InvitationIdParamsSchema, req.params);
    const invitation = await invitationService.acceptInvitation(
      userId,
      params.id,
    );

    const response: ApiSuccessResponse<InvitationResponse> = {
      data: invitation,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function declineInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(InvitationIdParamsSchema, req.params);
    const invitation = await invitationService.declineInvitation(
      userId,
      params.id,
    );

    const response: ApiSuccessResponse<InvitationResponse> = {
      data: invitation,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function cancelInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const params = parseSchema(InvitationIdParamsSchema, req.params);

    await invitationService.cancelInvitation(userId, params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
