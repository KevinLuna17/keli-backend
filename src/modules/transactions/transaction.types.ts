import {
  transactionTypeEnum,
  transactionsTable,
} from "./transaction.table";

export type TransactionRow = typeof transactionsTable.$inferSelect;
export type NewTransactionRow = typeof transactionsTable.$inferInsert;
export type TransactionType =
  (typeof transactionTypeEnum.enumValues)[number];

export type TransactionRecord = {
  id: string;
  workspaceId: string;
  categoryId: string;
  createdBy: string;
  type: TransactionType;
  amountInCents: number;
  description: string;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateTransactionInput = {
  workspaceId: string;
  categoryId: string;
  createdBy: string;
  type: TransactionType;
  amountInCents: number;
  description: string;
  transactionDate: Date;
};

export type UpdateTransactionInput = {
  categoryId?: string;
  type?: TransactionType;
  amountInCents?: number;
  description?: string;
  transactionDate?: Date;
};

export type ListTransactionsFilters = {
  workspaceId: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
};

export type ListTransactionsResult = {
  data: TransactionRecord[];
  total: number;
  page: number;
  limit: number;
};
