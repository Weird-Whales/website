"use client";

import { useCurrency } from "./CurrencyProvider";

/**
 * Renders an ETH-denominated amount in the user's currently selected
 * currency. Server components can pass `eth` directly without needing to
 * import any context - the conversion happens client-side.
 */
export function Money({
  eth,
  decimals,
  showSymbol = true,
  compact = false,
  className,
}: {
  eth: number;
  decimals?: number;
  showSymbol?: boolean;
  /** Use abbreviated units (1.2K, 3.3M) once the value exceeds 10,000. */
  compact?: boolean;
  className?: string;
}) {
  const { format } = useCurrency();
  return (
    <span className={`${className ?? ""} whitespace-nowrap`.trim()}>
      {format(eth, { decimals, showSymbol, compact })}
    </span>
  );
}
