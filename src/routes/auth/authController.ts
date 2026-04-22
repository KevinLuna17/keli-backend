import { Request, Response } from "express";
import * as authService from "../../modules/auth/auth.service";
import { syncUserSchema } from "../../modules/auth/auth.schema";

export const syncUser = async (req: Request, res: Response) => {
  const parsed = syncUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const user = await authService.syncUser(
    req.user.id,
    parsed.data
  );

  res.json(user);
};