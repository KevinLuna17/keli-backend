import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../shared/errors/app-error";
import { parseSchema } from "../../shared/validators/parse-schema";
import * as authService from "../../modules/auth/auth.service";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { UserRecord } from "../../modules/users/user.types";

const SyncUserBodySchema = z.object({
  language: z.string().trim().max(10).optional(),
  region: z.string().trim().max(10).optional(),
  timezone: z.string().trim().max(100).optional(),
});

export async function syncUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const { language, region, timezone } = parseSchema(SyncUserBodySchema, req.body);
    const user = await authService.syncUser(req.user.id, region, timezone, language);

    const response: ApiSuccessResponse<UserRecord> = { data: user };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
