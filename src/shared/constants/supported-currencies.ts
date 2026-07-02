export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "COP",
  "MXN",
  "PEN",
  "CLP",
  "ARS",
  "UYU",
  "BRL",
  "CAD",
  "GBP",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: SupportedCurrency = "USD";

/**
 * Maps ISO 3166-1 alpha-2 country codes to their default workspace currency.
 * Covers the most common regions for the supported currencies.
 * Countries not listed default to USD.
 */
export const REGION_TO_CURRENCY: Record<string, SupportedCurrency> = {
  // USD — United States and dollarized economies
  US: "USD",
  EC: "USD",
  PA: "USD",
  PR: "USD",
  SV: "USD",
  // EUR — Eurozone
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  PT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
  SK: "EUR",
  SI: "EUR",
  EE: "EUR",
  LV: "EUR",
  LT: "EUR",
  CY: "EUR",
  MT: "EUR",
  // COP — Colombia
  CO: "COP",
  // MXN — Mexico
  MX: "MXN",
  // PEN — Peru
  PE: "PEN",
  // CLP — Chile
  CL: "CLP",
  // ARS — Argentina
  AR: "ARS",
  // UYU — Uruguay
  UY: "UYU",
  // BRL — Brazil
  BR: "BRL",
  // CAD — Canada
  CA: "CAD",
  // GBP — United Kingdom
  GB: "GBP",
};

export function getCurrencyForRegion(
  regionCode: string | null | undefined,
): SupportedCurrency {
  if (!regionCode) {
    return DEFAULT_CURRENCY;
  }

  return REGION_TO_CURRENCY[regionCode.toUpperCase()] ?? DEFAULT_CURRENCY;
}
