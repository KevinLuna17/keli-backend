import { and, desc, eq, isNull, sql, sum } from "drizzle-orm";
import { db } from "../../db";
import { categoriesTable } from "../../db/schema/categories-schema";
import { transactionsTable } from "../transactions/transaction.table";
import { mapTransactionRowToRecord } from "../transactions/transaction.mapper";
import { TransactionRecord } from "../transactions/transaction.types";
import {
  CategoryAggregateRow,
  MonthlyAggregateRow,
  WorkspaceTotals,
} from "./analytics.types";

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
  const [result] = await db
    .select({
      totalIncomeInCents: sql<number>`COALESCE(SUM(CASE WHEN ${transactionsTable.type} = 'income' THEN ${transactionsTable.amountInCents} ELSE 0 END), 0)`.mapWith(
        Number,
      ),
      totalExpensesInCents: sql<number>`COALESCE(SUM(CASE WHEN ${transactionsTable.type} = 'expense' THEN ${transactionsTable.amountInCents} ELSE 0 END), 0)`.mapWith(
        Number,
      ),
    })
    .from(transactionsTable)
    .where(workspaceConditions(workspaceId));

  return {
    totalIncomeInCents: result?.totalIncomeInCents ?? 0,
    totalExpensesInCents: result?.totalExpensesInCents ?? 0,
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

export async function getMonthlyAggregates(
  workspaceId: string,
  monthsBack = 12,
): Promise<MonthlyAggregateRow[]> {
  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);
  startDate.setMonth(startDate.getMonth() - (monthsBack - 1));

  const rows = await db
    .select({
      year: sql<number>`EXTRACT(YEAR FROM ${transactionsTable.transactionDate})`.mapWith(
        Number,
      ),
      month: sql<number>`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`.mapWith(
        Number,
      ),
      type: transactionsTable.type,
      total: sum(transactionsTable.amountInCents),
    })
    .from(transactionsTable)
    .where(
      and(
        workspaceConditions(workspaceId),
        sql`${transactionsTable.transactionDate} >= ${startDate}`,
      ),
    )
    .groupBy(
      sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate})`,
      sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`,
      transactionsTable.type,
    )
    .orderBy(
      sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate})`,
      sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`,
    );

  return rows.map((row) => ({
    year: row.year,
    month: row.month,
    type: row.type,
    total: toAmount(row.total),
  }));
}

export async function getCategoryAggregates(
  workspaceId: string,
  type: "income" | "expense",
): Promise<CategoryAggregateRow[]> {
  const rows = await db
    .select({
      categoryId: categoriesTable.id,
      categoryName: categoriesTable.name,
      total: sum(transactionsTable.amountInCents),
    })
    .from(transactionsTable)
    .innerJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id),
    )
    .where(
      and(
        workspaceConditions(workspaceId),
        eq(transactionsTable.type, type),
        isNull(categoriesTable.deleted_at),
      ),
    )
    .groupBy(categoriesTable.id, categoriesTable.name)
    .orderBy(desc(sum(transactionsTable.amountInCents)));

  return rows.map((row) => ({
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    total: toAmount(row.total),
  }));
}
