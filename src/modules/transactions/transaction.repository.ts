import {
  and,
  count,
  desc,
  eq,
  gte,
  isNull,
  lte,
  SQL,
  sql,
} from "drizzle-orm";
import { db } from "../../db";
import { transactionsTable } from "./transaction.table";
import { mapTransactionRowToRecord } from "./transaction.mapper";
import {
  CreateTransactionInput,
  ListTransactionsFilters,
  ListTransactionsResult,
  TransactionRecord,
  UpdateTransactionInput,
} from "./transaction.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function buildListConditions(
  filters: ListTransactionsFilters,
): SQL | undefined {
  const conditions: SQL[] = [
    eq(transactionsTable.workspaceId, filters.workspaceId),
    isNull(transactionsTable.deleted_at),
  ];

  if (filters.type !== undefined) {
    conditions.push(eq(transactionsTable.type, filters.type));
  }

  if (filters.categoryId !== undefined) {
    conditions.push(eq(transactionsTable.categoryId, filters.categoryId));
  }

  if (filters.startDate !== undefined) {
    conditions.push(gte(transactionsTable.transactionDate, filters.startDate));
  }

  if (filters.endDate !== undefined) {
    conditions.push(lte(transactionsTable.transactionDate, filters.endDate));
  }

  return and(...conditions);
}

/**
 * Returns true if at least one non-deleted transaction exists for the workspace.
 * Uses LIMIT 1 to avoid a full table scan — the answer is known as soon as one
 * row is found.
 */
export async function existsByWorkspaceId(
  workspaceId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ exists: sql<number>`1` })
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.workspaceId, workspaceId),
        isNull(transactionsTable.deleted_at),
      ),
    )
    .limit(1);

  return row !== undefined;
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionRecord> {
  const [row] = await db
    .insert(transactionsTable)
    .values({
      workspaceId: input.workspaceId,
      categoryId: input.categoryId,
      createdBy: input.createdBy,
      type: input.type,
      amountInCents: input.amountInCents,
      description: input.description,
      transactionDate: input.transactionDate,
    })
    .returning();

  return mapTransactionRowToRecord(row);
}

export async function getTransactionById(
  id: string,
): Promise<TransactionRecord | null> {
  const [row] = await db
    .select()
    .from(transactionsTable)
    .where(
      and(eq(transactionsTable.id, id), isNull(transactionsTable.deleted_at)),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return mapTransactionRowToRecord(row);
}

export async function listTransactions(
  filters: ListTransactionsFilters,
): Promise<ListTransactionsResult> {
  const page = filters.page ?? DEFAULT_PAGE;
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const offset = (page - 1) * limit;
  const whereClause = buildListConditions(filters);

  const [countResult] = await db
    .select({ total: count() })
    .from(transactionsTable)
    .where(whereClause);

  const rows = await db
    .select()
    .from(transactionsTable)
    .where(whereClause)
    .orderBy(desc(transactionsTable.transactionDate))
    .limit(limit)
    .offset(offset);

  return {
    data: rows.map(mapTransactionRowToRecord),
    total: countResult?.total ?? 0,
    page,
    limit,
  };
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
): Promise<TransactionRecord | null> {
  const updates: Partial<typeof transactionsTable.$inferInsert> = {
    updated_at: new Date(),
  };

  if (input.categoryId !== undefined) {
    updates.categoryId = input.categoryId;
  }

  if (input.type !== undefined) {
    updates.type = input.type;
  }

  if (input.amountInCents !== undefined) {
    updates.amountInCents = input.amountInCents;
  }

  if (input.description !== undefined) {
    updates.description = input.description;
  }

  if (input.transactionDate !== undefined) {
    updates.transactionDate = input.transactionDate;
  }

  const [row] = await db
    .update(transactionsTable)
    .set(updates)
    .where(
      and(eq(transactionsTable.id, id), isNull(transactionsTable.deleted_at)),
    )
    .returning();

  if (!row) {
    return null;
  }

  return mapTransactionRowToRecord(row);
}

export async function softDeleteTransaction(
  id: string,
): Promise<TransactionRecord | null> {
  const now = new Date();

  const [row] = await db
    .update(transactionsTable)
    .set({
      deleted_at: now,
      updated_at: now,
    })
    .where(
      and(eq(transactionsTable.id, id), isNull(transactionsTable.deleted_at)),
    )
    .returning();

  if (!row) {
    return null;
  }

  return mapTransactionRowToRecord(row);
}
