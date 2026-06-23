import * as workspaceService from "../workspaces/workspace.service";
import * as analyticsRepository from "./analytics.repository";
import { DashboardQueryDto } from "./analytics.schema";
import { WorkspaceDashboard } from "./analytics.types";

export async function getWorkspaceDashboard(
  userId: string,
  query: DashboardQueryDto,
): Promise<WorkspaceDashboard> {
  await workspaceService.assertWorkspaceAccess(userId, query.workspaceId);

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
