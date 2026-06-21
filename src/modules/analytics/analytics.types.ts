import { TransactionRecord } from "../transactions/transaction.types";

export type WorkspaceDashboard = {
  balanceInCents: number;
  totalIncomeInCents: number;
  totalExpensesInCents: number;
  recentTransactions: TransactionRecord[];
};

export type WorkspaceTotals = {
  totalIncomeInCents: number;
  totalExpensesInCents: number;
};
