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

export type AnalyticsSummary = {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
};

export type MonthlyAnalyticsItem = {
  month: string;
  income: number;
  expense: number;
};

export type CategoryAnalyticsItem = {
  categoryId: string;
  categoryName: string;
  amount: number;
};

export type MonthlyAggregateRow = {
  year: number;
  month: number;
  type: "income" | "expense";
  total: number;
};

export type CategoryAggregateRow = {
  categoryId: string;
  categoryName: string;
  total: number;
};
