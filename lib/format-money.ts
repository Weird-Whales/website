export type Currency = "ETH" | "USD" | "GBP";
export type Rates = { usd: number; gbp: number };

const SYMBOL: Record<Currency, string> = {
  ETH: "Ξ",
  USD: "$",
  GBP: "£",
};

/**
 * Formats a value originally denominated in ETH into the active currency.
 * Pure: works on the server, in client components, and inside SVG <text>.
 *
 * Pass `decimals` to force a precision; otherwise a sensible auto-precision
 * is chosen based on magnitude. Pass `compact` to switch to abbreviated
 * units (1.2K, 3.3M) once the value crosses 10,000 - useful for cramped
 * grid cells.
 */
export function formatMoney(
  eth: number,
  currency: Currency,
  rates: Rates,
  options: { decimals?: number; showSymbol?: boolean; compact?: boolean } = {},
): string {
  const { decimals, showSymbol = true, compact = false } = options;

  let value: number;
  if (currency === "ETH") {
    value = eth;
  } else {
    const rate = currency === "USD" ? rates.usd : rates.gbp;
    value = eth * rate;
  }

  // ETH magnitudes are smaller than USD/GBP, so trigger compact earlier
  // in ETH mode so volume figures like 1,941 don't overflow tight columns.
  const compactThreshold = currency === "ETH" ? 1_000 : 10_000;
  const useCompact = compact && Math.abs(value) >= compactThreshold;

  let formatted: string;
  if (useCompact) {
    formatted = value.toLocaleString("en-US", {
      notation: "compact",
      maximumFractionDigits: Math.abs(value) >= 1_000_000 ? 1 : 0,
    });
  } else {
    let dec: number;
    if (currency === "ETH") {
      dec =
        decimals ??
        (eth === 0
          ? 0
          : Math.abs(eth) >= 100
            ? 1
            : Math.abs(eth) >= 1
              ? 3
              : 4);
    } else {
      dec =
        decimals ??
        (value === 0
          ? 0
          : Math.abs(value) >= 1000
            ? 0
            : Math.abs(value) >= 10
              ? 1
              : 2);
    }
    formatted = value.toLocaleString("en-US", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  }

  if (!showSymbol) return formatted;

  return currency === "ETH"
    ? `${formatted} ${SYMBOL.ETH}`
    : `${SYMBOL[currency]}${formatted}`;
}

export const CURRENCY_SYMBOL = SYMBOL;
