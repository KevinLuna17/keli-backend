import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import { PatchPreferencesBodySchema } from "./preferences.schema";
import * as preferencesService from "./preferences.service";
import { PreferencesResponse } from "./preferences.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function getPreferences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const preferences = await preferencesService.getPreferences(userId);

    const response: ApiSuccessResponse<PreferencesResponse> = {
      data: preferences,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const body = parseSchema(PatchPreferencesBodySchema, req.body);
    const preferences = await preferencesService.updatePreferences(userId, body);

    const response: ApiSuccessResponse<PreferencesResponse> = {
      data: preferences,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
