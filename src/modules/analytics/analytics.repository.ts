import { and, desc, eq, isNull, sum } from "drizzle-orm";
import { db } from "../../db";
import { transactionsTable } from "../transactions/transaction.table";
import { mapTransactionRowToRecord } from "../transactions/transaction.mapper";
import { TransactionRecord } from "../transactions/transaction.types";
import { WorkspaceTotals } from "./analytics.types";

const RECENT_TRANSACTIONS_LIMIT = 10;

function workspaceConditions(workspaceId: string) {
  return and(
    eq(transactionsTable.workspaceId, workspaceId),
    isNull(transactionsTable.deleted_at),
  );
}

function toAmount(value: string | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}

export async function getWorkspaceTotals(
  workspaceId: string,
): Promise<WorkspaceTotals> {
  const baseCondition = workspaceConditions(workspaceId);

  const [incomeResult] = await db
    .select({ total: sum(transactionsTable.amountInCents) })
    .from(transactionsTable)
    .where(and(baseCondition, eq(transactionsTable.type, "income")));

  const [expenseResult] = await db
    .select({ total: sum(transactionsTable.amountInCents) })
    .from(transactionsTable)
    .where(and(baseCondition, eq(transactionsTable.type, "expense")));

  return {
    totalIncomeInCents: toAmount(incomeResult?.total),
    totalExpensesInCents: toAmount(expenseResult?.total),
  };
}

export async function getRecentTransactions(
  workspaceId: string,
  limit = RECENT_TRANSACTIONS_LIMIT,
): Promise<TransactionRecord[]> {
  const rows = await db
    .select()
    .from(transactionsTable)
    .where(workspaceConditions(workspaceId))
    .orderBy(desc(transactionsTable.transactionDate))
    .limit(limit);

  return rows.map(mapTransactionRowToRecord);
}
