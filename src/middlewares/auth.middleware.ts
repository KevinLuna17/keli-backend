import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    res.status(401).json({
      error: {
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      },
    });
    return;
  }

  req.user = { id: userId };
  next();
}
