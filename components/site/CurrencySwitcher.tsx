"use client";

import { useCurrency } from "./CurrencyProvider";
import type { Currency } from "@/lib/format-money";

const OPTIONS: Currency[] = ["ETH", "USD", "GBP"];

export function CurrencySwitcher() {
  const { currency, setCurrency, rates } = useCurrency();

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap md:justify-start">
      <div className="font-pixel text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
        Display in
      </div>
      <div className="inline-flex rounded-md border border-white/10 bg-white/5 p-0.5">
        {OPTIONS.map((c) => {
          const active = currency === c;
          return (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`font-pixel text-[10px] tracking-[0.18em] uppercase rounded px-2.5 py-1 transition-colors ${
                active
                  ? "bg-[var(--ww-pink)] text-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={active}
            >
              {c}
            </button>
          );
        })}
      </div>
      {rates.usd > 0 && (
        <div className="font-pixel text-[9px] tracking-[0.18em] uppercase text-muted-foreground/70 tabular-nums">
          1 Ξ ≈ ${rates.usd.toLocaleString("en-US", { maximumFractionDigits: 0 })} · £{rates.gbp.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
      )}
    </div>
  );
}
