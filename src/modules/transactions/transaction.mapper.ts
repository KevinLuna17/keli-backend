import { TransactionRecord, TransactionRow } from "./transaction.types";

export function mapTransactionRowToRecord(
  row: TransactionRow,
): TransactionRecord {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    categoryId: row.categoryId,
    createdBy: row.createdBy,
    type: row.type,
    amountInCents: row.amountInCents,
    description: row.description,
    notes: row.notes,
    transactionDate: row.transactionDate,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
