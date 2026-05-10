"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  formatMoney,
  type Currency,
  type Rates,
} from "@/lib/format-money";

const STORAGE_KEY = "ww-currency";

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Rates;
  format: (
    eth: number,
    opts?: { decimals?: number; showSymbol?: boolean; compact?: boolean },
  ) => string;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({
  rates,
  children,
}: {
  rates: Rates;
  children: ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>("ETH");

  // After mount, restore the user's saved preference. localStorage isn't
  // available during SSR so we deliberately read it post-hydration; the
  // brief flash from default → saved is acceptable.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ETH" || saved === "USD" || saved === "GBP") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrencyState(saved);
      }
    } catch {
      // localStorage may be unavailable (SSR, privacy mode) - ignore.
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }, []);

  const format = useCallback(
    (
      eth: number,
      opts?: { decimals?: number; showSymbol?: boolean; compact?: boolean },
    ) => formatMoney(eth, currency, rates, opts),
    [currency, rates],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, rates, format }),
    [currency, setCurrency, rates, format],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside a CurrencyProvider");
  }
  return ctx;
}
