export const CATEGORY_ICON_KEYS = [
  "food",
  "transport",
  "housing",
  "utilities",
  "healthcare",
  "shopping",
  "entertainment",
  "education",
  "travel",
  "subscriptions",
  "salary",
  "freelance",
  "bonus",
  "investment",
  "gift",
  "other",
  "folder",
  "tag",
  "bookmark",
  "star",
] as const;

export type CategoryIconKey = (typeof CATEGORY_ICON_KEYS)[number];

export const DEFAULT_CATEGORY_ICON_KEY: CategoryIconKey = "folder";

export function isCategoryIconKey(value: string): value is CategoryIconKey {
  return (CATEGORY_ICON_KEYS as readonly string[]).includes(value);
}

/** Default icon for each seeded category name (English provisioning labels). */
export const DEFAULT_ICON_KEY_BY_CATEGORY_NAME: Record<
  string,
  CategoryIconKey
> = {
  Food: "food",
  Transport: "transport",
  Housing: "housing",
  Utilities: "utilities",
  Healthcare: "healthcare",
  Shopping: "shopping",
  Entertainment: "entertainment",
  Education: "education",
  Travel: "travel",
  Subscriptions: "subscriptions",
  Salary: "salary",
  Freelance: "freelance",
  Bonus: "bonus",
  Investment: "investment",
  Gift: "gift",
  Other: "other",
};
