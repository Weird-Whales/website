"use client";

import { useCurrency } from "./CurrencyProvider";
import { CountUp } from "./CountUp";
import { CURRENCY_SYMBOL } from "@/lib/format-money";

/**
 * Animated number-only count, in the active currency. No symbol - pair
 * with `<MoneySymbol />` in a label or use `<MoneyStat>` for the inline form.
 *
 * Pass `compact` to render values ≥ 10,000 as "12K" / "3.3M" - handy in
 * cramped grid cells where USD/GBP magnitudes overflow.
 */
export function MoneyStatValue({
  eth,
  decimals,
  compact = false,
  className,
}: {
  eth: number;
  decimals?: number;
  compact?: boolean;
  className?: string;
}) {
  const { currency, rates, format } = useCurrency();
  let value = eth;
  if (currency === "USD") value = eth * rates.usd;
  if (currency === "GBP") value = eth * rates.gbp;

  if (compact && Math.abs(value) >= 10_000) {
    // CountUp animates a number, but compact notation is non-numeric. Show
    // the static formatted string instead - animation gracefully degrades.
    return (
      <span className={className}>
        {format(eth, { compact, showSymbol: false })}
      </span>
    );
  }

  let dec = decimals;
  if (dec == null) {
    if (currency === "ETH") {
      dec = Math.abs(value) >= 100 ? 1 : Math.abs(value) >= 1 ? 3 : 4;
    } else {
      dec = Math.abs(value) >= 1000 ? 0 : Math.abs(value) >= 10 ? 1 : 2;
    }
  }
  return <CountUp to={value} decimals={dec} className={className} />;
}

/** Renders just the active currency's symbol. */
export function MoneySymbol() {
  const { currency } = useCurrency();
  return <>{CURRENCY_SYMBOL[currency]}</>;
}

/**
 * Animated number stat that respects the active currency. Pass the value
 * in ETH and the magnitude is converted automatically.
 */
export function MoneyStat({
  eth,
  decimals,
  className,
}: {
  eth: number;
  decimals?: number;
  className?: string;
}) {
  const { currency, rates } = useCurrency();

  let value = eth;
  let dec = decimals;
  if (currency === "USD") value = eth * rates.usd;
  if (currency === "GBP") value = eth * rates.gbp;

  if (dec == null) {
    if (currency === "ETH") {
      dec = Math.abs(value) >= 100 ? 1 : Math.abs(value) >= 1 ? 3 : 4;
    } else {
      dec = Math.abs(value) >= 1000 ? 0 : Math.abs(value) >= 10 ? 1 : 2;
    }
  }

  const wrap = `${className ?? ""} whitespace-nowrap`.trim();
  if (currency === "ETH") {
    return (
      <span className={wrap}>
        <CountUp to={value} decimals={dec} />
        {" "}
        {CURRENCY_SYMBOL.ETH}
      </span>
    );
  }
  return (
    <span className={wrap}>
      {CURRENCY_SYMBOL[currency]}
      <CountUp to={value} decimals={dec} />
    </span>
  );
}
