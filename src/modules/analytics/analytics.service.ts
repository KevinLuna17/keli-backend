import { AppError } from "../../shared/errors/app-error";
import * as workspacesRepository from "../workspaces/workspaces.repository";
import * as analyticsRepository from "./analytics.repository";
import { DashboardQueryDto } from "./analytics.schema";
import { WorkspaceDashboard } from "./analytics.types";

async function assertWorkspaceAccess(
  userId: string,
  workspaceId: string,
): Promise<void> {
  const workspace = await workspacesRepository.findById(workspaceId);

  if (!workspace) {
    throw new AppError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  if (workspace.ownerId !== userId) {
    throw new AppError(
      "You do not have access to this workspace",
      403,
      "WORKSPACE_ACCESS_DENIED",
    );
  }
}

export async function getWorkspaceDashboard(
  userId: string,
  query: DashboardQueryDto,
): Promise<WorkspaceDashboard> {
  await assertWorkspaceAccess(userId, query.workspaceId);

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
