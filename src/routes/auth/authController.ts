import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../shared/errors/app-error";
import * as authService from "../../modules/auth/auth.service";

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

    const body = SyncUserBodySchema.safeParse(req.body);
    const language = body.success ? body.data.language : undefined;
    const region = body.success ? body.data.region : undefined;
    const timezone = body.success ? body.data.timezone : undefined;

    const user = await authService.syncUser(req.user.id, region, timezone, language);

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}
