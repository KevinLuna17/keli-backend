import {
  CategoryIconKey,
  DEFAULT_CATEGORY_ICON_KEY,
  DEFAULT_ICON_KEY_BY_CATEGORY_NAME,
  isCategoryIconKey,
} from "../../shared/constants/category-icon-keys";
import { CategoryType } from "./category.types";

type ResolveIconKeyInput = {
  name: string;
  type: CategoryType;
  iconKey?: string | null;
};

/** Lightweight keyword hints for user-created category names. */
const KEYWORD_ICON_MATCHERS: Array<{
  pattern: RegExp;
  iconKey: CategoryIconKey;
}> = [
  { pattern: /\b(food|comida|restaurant|grocer|supermarket)\b/i, iconKey: "food" },
  { pattern: /\b(transport|uber|taxi|bus|gas|fuel|car)\b/i, iconKey: "transport" },
  { pattern: /\b(rent|housing|mortgage|home)\b/i, iconKey: "housing" },
  { pattern: /\b(utilit|electric|water|internet|phone)\b/i, iconKey: "utilities" },
  { pattern: /\b(health|doctor|medical|pharmacy|gym)\b/i, iconKey: "healthcare" },
  { pattern: /\b(shop|store|amazon|clothes)\b/i, iconKey: "shopping" },
  { pattern: /\b(movie|game|netflix|spotify|fun)\b/i, iconKey: "entertainment" },
  { pattern: /\b(school|course|university|education)\b/i, iconKey: "education" },
  { pattern: /\b(travel|flight|hotel|vacation)\b/i, iconKey: "travel" },
  { pattern: /\b(subscription|membership)\b/i, iconKey: "subscriptions" },
  { pattern: /\b(salary|payroll|sueldo|nomina)\b/i, iconKey: "salary" },
  { pattern: /\b(freelance|contract|consult)\b/i, iconKey: "freelance" },
  { pattern: /\b(bonus|commission)\b/i, iconKey: "bonus" },
  { pattern: /\b(invest|dividend|stock|crypto)\b/i, iconKey: "investment" },
  { pattern: /\b(gift|regalo)\b/i, iconKey: "gift" },
];

function matchIconKeyByKeyword(name: string): CategoryIconKey | null {
  for (const matcher of KEYWORD_ICON_MATCHERS) {
    if (matcher.pattern.test(name)) {
      return matcher.iconKey;
    }
  }

  return null;
}

export function resolveIconKeyForCategory(
  input: ResolveIconKeyInput,
): CategoryIconKey {
  if (input.iconKey && isCategoryIconKey(input.iconKey)) {
    return input.iconKey;
  }

  const seededIcon = DEFAULT_ICON_KEY_BY_CATEGORY_NAME[input.name.trim()];
  if (seededIcon) {
    return seededIcon;
  }

  const keywordIcon = matchIconKeyByKeyword(input.name);
  if (keywordIcon) {
    return keywordIcon;
  }

  return DEFAULT_CATEGORY_ICON_KEY;
}
