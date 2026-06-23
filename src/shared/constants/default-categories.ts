import type { CategoryIconKey } from "./category-icon-keys";
import { DEFAULT_ICON_KEY_BY_CATEGORY_NAME } from "./category-icon-keys";

export type CategoryType = "income" | "expense";

export type DefaultCategoryDefinition = {
  name: string;
  type: CategoryType;
  iconKey: CategoryIconKey;
};

function defineDefault(
  name: string,
  type: CategoryType,
): DefaultCategoryDefinition {
  return {
    name,
    type,
    iconKey: DEFAULT_ICON_KEY_BY_CATEGORY_NAME[name] ?? "folder",
  };
}

export const DEFAULT_EXPENSE_CATEGORIES: DefaultCategoryDefinition[] = [
  defineDefault("Food", "expense"),
  defineDefault("Transport", "expense"),
  defineDefault("Housing", "expense"),
  defineDefault("Utilities", "expense"),
  defineDefault("Healthcare", "expense"),
  defineDefault("Shopping", "expense"),
  defineDefault("Entertainment", "expense"),
  defineDefault("Education", "expense"),
  defineDefault("Travel", "expense"),
  defineDefault("Subscriptions", "expense"),
  defineDefault("Other", "expense"),
];

export const DEFAULT_INCOME_CATEGORIES: DefaultCategoryDefinition[] = [
  defineDefault("Salary", "income"),
  defineDefault("Freelance", "income"),
  defineDefault("Bonus", "income"),
  defineDefault("Investment", "income"),
  defineDefault("Gift", "income"),
  defineDefault("Other", "income"),
];

export const DEFAULT_CATEGORIES: DefaultCategoryDefinition[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];
