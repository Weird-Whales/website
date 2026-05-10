import "server-only";
import salesHistory from "@/utils/sales-history.json";
import { getSalesSince, type SaleEvent } from "./opensea";
import type { SalesDay } from "@/components/site/FloorHistoryChart";
import type { TopSale } from "@/components/site/TopSalesAllTime";

export type MergedSalesHistory = {
  generatedAt: string;
  lifetime: {
    sales: number;
    volumeEth: number;
    avgEth: number;
    firstSaleTs: number | null;
    lastSaleTs: number | null;
  };
  days: SalesDay[];
  topSales: TopSale[];
};

/**
 * Returns the static sales-history JSON merged with any new sales since the
 * snapshot was last taken. Lets us keep a small, mostly-static baseline in
 * the repo while staying fresh on every render. Cached at the OpenSea
 * fetch layer (`getSalesSince`) for 10 minutes.
 */
export async function getMergedSalesHistory(): Promise<MergedSalesHistory> {
  const base = salesHistory as MergedSalesHistory;
  const since = base.lifetime.lastSaleTs ?? 0;
  const newSales = await getSalesSince(since);
  if (newSales.length === 0) return base;

  // Merge into day buckets.
  const dayByTs = new Map<number, SalesDay>();
  for (const d of base.days) dayByTs.set(d.ts, { ...d });

  for (const s of newSales) {
    const d = new Date(s.ts);
    const key = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    let bucket = dayByTs.get(key);
    if (!bucket) {
      bucket = { ts: key, sales: 0, volume: 0, min: Infinity, max: 0, avg: 0 };
      dayByTs.set(key, bucket);
    }
    bucket.sales++;
    bucket.volume = round4(bucket.volume + s.priceEth);
    bucket.min =
      bucket.min === 0 || s.priceEth < bucket.min ? s.priceEth : bucket.min;
    bucket.max = s.priceEth > bucket.max ? s.priceEth : bucket.max;
  }
  const days = Array.from(dayByTs.values())
    .sort((a, b) => a.ts - b.ts)
    .map((b) => ({
      ts: b.ts,
      sales: b.sales,
      volume: round4(b.volume),
      min: round4(b.min === Infinity ? 0 : b.min),
      max: round4(b.max),
      avg: round4(b.volume / Math.max(1, b.sales)),
    }));

  // Merge top sales.
  const newAsTop: TopSale[] = newSales.map((s) => ({
    tokenId: s.tokenId,
    priceEth: round4(s.priceEth),
    symbol: s.symbol,
    ts: s.ts,
    seller: s.seller,
    buyer: s.buyer,
  }));
  const topSales = [...base.topSales, ...newAsTop]
    .sort((a, b) => b.priceEth - a.priceEth)
    .slice(0, 25);

  // Lifetime.
  const newVolume = newSales.reduce((acc, s) => acc + s.priceEth, 0);
  const newCount = newSales.length;
  const totalSales = base.lifetime.sales + newCount;
  const totalVolume = round4(base.lifetime.volumeEth + newVolume);
  const lastSale: SaleEvent | undefined = newSales[newSales.length - 1];

  return {
    generatedAt: new Date().toISOString(),
    lifetime: {
      sales: totalSales,
      volumeEth: totalVolume,
      avgEth: round4(totalVolume / Math.max(1, totalSales)),
      firstSaleTs: base.lifetime.firstSaleTs,
      lastSaleTs: lastSale ? lastSale.ts : base.lifetime.lastSaleTs,
    },
    days,
    topSales,
  };
}

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}
