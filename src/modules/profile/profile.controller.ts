import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import * as profileService from "./profile.service";
import { UpdateProfileBodySchema } from "./profile.schema";
import { ProfileResponse } from "./profile.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const profile = await profileService.getProfile(userId);

    const response: ApiSuccessResponse<ProfileResponse> = {
      data: profile,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const body = parseSchema(UpdateProfileBodySchema, req.body);
    const profile = await profileService.updateProfile(userId, body);

    const response: ApiSuccessResponse<ProfileResponse> = {
      data: profile,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
