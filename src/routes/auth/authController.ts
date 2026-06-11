import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import * as authService from "../../modules/auth/auth.service";

export async function syncUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user?.id) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = await authService.syncUser(req.user.id);

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}
