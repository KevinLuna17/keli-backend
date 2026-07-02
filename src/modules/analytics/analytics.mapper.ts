import {
  AnalyticsSummary,
  CategoryAggregateRow,
  CategoryAnalyticsItem,
  MonthlyAggregateRow,
  MonthlyAnalyticsItem,
  WorkspaceTotals,
} from "./analytics.types";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function mapWorkspaceTotalsToSummary(
  totals: WorkspaceTotals,
  balanceInCents: number,
): AnalyticsSummary {
  return {
    balance: balanceInCents,
    totalIncome: totals.totalIncomeInCents,
    totalExpenses: totals.totalExpensesInCents,
    savings: balanceInCents,
  };
}

function monthKey(year: number, month: number): string {
  return `${year}-${month}`;
}

export function mapMonthlyAggregatesToResponse(
  rows: MonthlyAggregateRow[],
  monthsToInclude = 12,
  fromDate = new Date(),
): MonthlyAnalyticsItem[] {
  const totalsByMonth = new Map<string, { income: number; expense: number }>();

  for (const row of rows) {
    const key = monthKey(row.year, row.month);
    const current = totalsByMonth.get(key) ?? { income: 0, expense: 0 };

    if (row.type === "income") {
      current.income = row.total;
    } else {
      current.expense = row.total;
    }

    totalsByMonth.set(key, current);
  }

  const results: MonthlyAnalyticsItem[] = [];

  for (let offset = monthsToInclude - 1; offset >= 0; offset -= 1) {
    const date = new Date(fromDate.getFullYear(), fromDate.getMonth() - offset, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = monthKey(year, month);
    const totals = totalsByMonth.get(key) ?? { income: 0, expense: 0 };

    results.push({
      month: MONTH_LABELS[month - 1],
      income: totals.income,
      expense: totals.expense,
    });
  }

  return results;
}

export function mapCategoryAggregatesToResponse(
  rows: CategoryAggregateRow[],
): CategoryAnalyticsItem[] {
  return rows.map((row) => ({
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    amount: row.total,
  }));
}
