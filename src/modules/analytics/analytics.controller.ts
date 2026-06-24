import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";
import { ApiSuccessResponse } from "../../shared/types/api-response";
import { parseSchema } from "../../shared/validators/parse-schema";
import {
  DashboardQuerySchema,
  WorkspaceAnalyticsQuerySchema,
} from "./analytics.schema";
import * as analyticsService from "./analytics.service";
import {
  AnalyticsSummary,
  CategoryAnalyticsItem,
  MonthlyAnalyticsItem,
  WorkspaceDashboard,
} from "./analytics.types";

function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return req.user.id;
}

export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(DashboardQuerySchema, req.query);

    const dashboard = await analyticsService.getWorkspaceDashboard(
      userId,
      query,
    );

    const response: ApiSuccessResponse<WorkspaceDashboard> = {
      data: dashboard,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(WorkspaceAnalyticsQuerySchema, req.query);
    const summary = await analyticsService.getAnalyticsSummary(userId, query);

    const response: ApiSuccessResponse<AnalyticsSummary> = {
      data: summary,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getMonthly(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(WorkspaceAnalyticsQuerySchema, req.query);
    const monthly = await analyticsService.getMonthlyAnalytics(userId, query);

    const response: ApiSuccessResponse<MonthlyAnalyticsItem[]> = {
      data: monthly,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getExpensesByCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(WorkspaceAnalyticsQuerySchema, req.query);
    const categories = await analyticsService.getExpensesByCategory(
      userId,
      query,
    );

    const response: ApiSuccessResponse<CategoryAnalyticsItem[]> = {
      data: categories,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getIncomeByCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = parseSchema(WorkspaceAnalyticsQuerySchema, req.query);
    const categories = await analyticsService.getIncomeByCategory(
      userId,
      query,
    );

    const response: ApiSuccessResponse<CategoryAnalyticsItem[]> = {
      data: categories,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
