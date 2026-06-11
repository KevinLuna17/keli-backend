import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

type ClerkAPIError = {
  clerkError: true;
  status: number;
  errors?: Array<{ code?: string; message?: string }>;
};

function isClerkAPIError(error: unknown): error is ClerkAPIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "clerkError" in error &&
    (error as ClerkAPIError).clerkError === true
  );
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  if (isClerkAPIError(error)) {
    const clerkMessage =
      error.errors?.[0]?.message ?? "Authentication provider error";
    const status = error.status >= 400 && error.status < 600 ? error.status : 502;

    res.status(status).json({
      error: {
        message: clerkMessage,
        code: error.errors?.[0]?.code ?? "CLERK_API_ERROR",
      },
    });
    return;
  }

  console.error("Unhandled error:", error);

  res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    },
  });
}
