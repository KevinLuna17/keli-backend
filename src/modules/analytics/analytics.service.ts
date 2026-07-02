import * as workspaceService from "../workspaces/workspace.service";
import {
  mapCategoryAggregatesToResponse,
  mapMonthlyAggregatesToResponse,
  mapWorkspaceTotalsToSummary,
} from "./analytics.mapper";
import * as analyticsRepository from "./analytics.repository";
import { DashboardQueryDto, WorkspaceAnalyticsQueryDto } from "./analytics.schema";
import {
  AnalyticsSummary,
  CategoryAnalyticsItem,
  MonthlyAnalyticsItem,
  WorkspaceDashboard,
} from "./analytics.types";

async function assertAnalyticsWorkspaceAccess(
  userId: string,
  workspaceId: string,
): Promise<void> {
  await workspaceService.assertWorkspaceAccess(userId, workspaceId);
}

export async function getWorkspaceDashboard(
  userId: string,
  query: DashboardQueryDto,
): Promise<WorkspaceDashboard> {
  await assertAnalyticsWorkspaceAccess(userId, query.workspaceId);

  const [totals, recentTransactions] = await Promise.all([
    analyticsRepository.getWorkspaceTotals(query.workspaceId),
    analyticsRepository.getRecentTransactions(query.workspaceId),
  ]);

  return {
    balanceInCents: totals.totalIncomeInCents - totals.totalExpensesInCents,
    totalIncomeInCents: totals.totalIncomeInCents,
    totalExpensesInCents: totals.totalExpensesInCents,
    recentTransactions,
  };
}

export async function getAnalyticsSummary(
  userId: string,
  query: WorkspaceAnalyticsQueryDto,
): Promise<AnalyticsSummary> {
  await assertAnalyticsWorkspaceAccess(userId, query.workspaceId);

  const totals = await analyticsRepository.getWorkspaceTotals(query.workspaceId);
  const balanceInCents = totals.totalIncomeInCents - totals.totalExpensesInCents;

  return mapWorkspaceTotalsToSummary(totals, balanceInCents);
}

export async function getMonthlyAnalytics(
  userId: string,
  query: WorkspaceAnalyticsQueryDto,
): Promise<MonthlyAnalyticsItem[]> {
  await assertAnalyticsWorkspaceAccess(userId, query.workspaceId);

  const rows = await analyticsRepository.getMonthlyAggregates(query.workspaceId);

  return mapMonthlyAggregatesToResponse(rows);
}

export async function getExpensesByCategory(
  userId: string,
  query: WorkspaceAnalyticsQueryDto,
): Promise<CategoryAnalyticsItem[]> {
  await assertAnalyticsWorkspaceAccess(userId, query.workspaceId);

  const rows = await analyticsRepository.getCategoryAggregates(
    query.workspaceId,
    "expense",
  );

  return mapCategoryAggregatesToResponse(rows);
}

export async function getIncomeByCategory(
  userId: string,
  query: WorkspaceAnalyticsQueryDto,
): Promise<CategoryAnalyticsItem[]> {
  await assertAnalyticsWorkspaceAccess(userId, query.workspaceId);

  const rows = await analyticsRepository.getCategoryAggregates(
    query.workspaceId,
    "income",
  );

  return mapCategoryAggregatesToResponse(rows);
}
