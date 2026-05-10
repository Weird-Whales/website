#!/usr/bin/env node
/**
 * Pulls every sale event for Weird Whales from OpenSea v2 events API,
 * buckets them by day, and writes utils/sales-history.json with:
 *   - daily { volume, sales, avg, min, max } in ETH (only for ETH/WETH sales)
 *   - top 25 all-time sales
 *   - lifetime totals
 *
 * Requires OPENSEA_API_KEY in .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Prefer process.env (Vercel build / CI), fall back to .env.local for local dev.
let KEY = process.env.OPENSEA_API_KEY;
if (!KEY) {
  try {
    const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
    KEY = env.match(/OPENSEA_API_KEY=(.+)/)?.[1]?.trim();
  } catch {
    // .env.local not present — fine on Vercel where env vars come from the dashboard.
  }
}
if (!KEY) {
  console.error("Missing OPENSEA_API_KEY (env or .env.local)");
  process.exit(1);
}

const SLUG = "weirdwhales";
const BASE = "https://api.opensea.io/api/v2";
const PAGE_LIMIT = 50;

async function fetchEventsPage(cursor) {
  const url = new URL(`${BASE}/events/collection/${SLUG}`);
  url.searchParams.set("event_type", "sale");
  url.searchParams.set("limit", String(PAGE_LIMIT));
  if (cursor) url.searchParams.set("next", cursor);
  const res = await fetch(url, {
    headers: { "X-API-KEY": KEY, Accept: "application/json" },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`OpenSea ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

console.log("Fetching all sale events…");
const all = [];
let cursor = undefined;
let pages = 0;
while (true) {
  let j;
  try {
    j = await fetchEventsPage(cursor);
  } catch (e) {
    // backoff once on 429/5xx, then retry
    console.warn(`  retry after error: ${e.message}`);
    await new Promise((r) => setTimeout(r, 2000));
    j = await fetchEventsPage(cursor);
  }
  const events = j.asset_events ?? [];
  all.push(...events);
  pages++;
  process.stdout.write(`  page ${pages}: +${events.length} (total ${all.length})\n`);
  cursor = j.next;
  if (!cursor || events.length === 0) break;
  await new Promise((r) => setTimeout(r, 250));
}
console.log(`Fetched ${all.length} sale events.`);

// Filter to ETH/WETH sales (other currencies show up rarely; conversion is messy).
const ETH_SYMBOLS = new Set(["ETH", "WETH"]);
const sales = [];
for (const ev of all) {
  const sym = ev?.payment?.symbol;
  const qty = ev?.payment?.quantity;
  const decimals = ev?.payment?.decimals ?? 18;
  const ts = ev?.event_timestamp;
  const id = ev?.nft?.identifier;
  if (!sym || !ETH_SYMBOLS.has(sym)) continue;
  if (!qty || !ts || !id) continue;
  const priceEth = Number(qty) / 10 ** decimals;
  if (!Number.isFinite(priceEth) || priceEth <= 0) continue;
  sales.push({
    tokenId: Number(id),
    priceEth,
    symbol: sym,
    ts: Number(ts) * 1000,
    seller: ev.seller ?? ev.from_address ?? null,
    buyer: ev.buyer ?? ev.to_address ?? null,
  });
}
sales.sort((a, b) => a.ts - b.ts);
console.log(`Kept ${sales.length} ETH/WETH sales.`);

// Bucket by UTC day.
const dayBuckets = new Map();
for (const s of sales) {
  const d = new Date(s.ts);
  const key = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  let b = dayBuckets.get(key);
  if (!b) {
    b = { ts: key, sales: 0, volume: 0, min: Infinity, max: 0, prices: [] };
    dayBuckets.set(key, b);
  }
  b.sales++;
  b.volume += s.priceEth;
  b.min = Math.min(b.min, s.priceEth);
  b.max = Math.max(b.max, s.priceEth);
  b.prices.push(s.priceEth);
}
const days = Array.from(dayBuckets.values())
  .sort((a, b) => a.ts - b.ts)
  .map((b) => ({
    ts: b.ts,
    sales: b.sales,
    volume: Number(b.volume.toFixed(4)),
    min: Number(b.min.toFixed(4)),
    max: Number(b.max.toFixed(4)),
    avg: Number((b.volume / b.sales).toFixed(4)),
  }));

// Top sales all-time (any currency that's ETH/WETH).
const topSales = sales
  .slice()
  .sort((a, b) => b.priceEth - a.priceEth)
  .slice(0, 25)
  .map((s) => ({
    tokenId: s.tokenId,
    priceEth: Number(s.priceEth.toFixed(4)),
    symbol: s.symbol,
    ts: s.ts,
    seller: s.seller,
    buyer: s.buyer,
  }));

// Lifetime totals.
const lifetimeVolume = sales.reduce((s, x) => s + x.priceEth, 0);
const lifetimeSales = sales.length;
const firstSale = sales[0];
const lastSale = sales[sales.length - 1];

// Most-active wallets (by sales touched, buy or sell).
const walletCounts = new Map();
for (const s of sales) {
  if (s.buyer) walletCounts.set(s.buyer.toLowerCase(), (walletCounts.get(s.buyer.toLowerCase()) ?? 0) + 1);
  if (s.seller) walletCounts.set(s.seller.toLowerCase(), (walletCounts.get(s.seller.toLowerCase()) ?? 0) + 1);
}
const topTraders = Array.from(walletCounts.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([address, count]) => ({ address, count }));

const out = {
  generatedAt: new Date().toISOString(),
  lifetime: {
    sales: lifetimeSales,
    volumeEth: Number(lifetimeVolume.toFixed(4)),
    avgEth: Number((lifetimeVolume / Math.max(1, lifetimeSales)).toFixed(4)),
    firstSaleTs: firstSale?.ts ?? null,
    lastSaleTs: lastSale?.ts ?? null,
  },
  days,
  topSales,
  topTraders,
};

const outPath = path.join(ROOT, "utils/sales-history.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`\nWrote ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
console.log(`Lifetime: ${lifetimeSales} sales, ${lifetimeVolume.toFixed(2)} ETH volume`);
console.log(`First sale: ${firstSale ? new Date(firstSale.ts).toISOString() : "n/a"}`);
console.log(`Last sale:  ${lastSale ? new Date(lastSale.ts).toISOString() : "n/a"}`);
console.log(`Days with sales: ${days.length}`);
console.log(`Top sale: #${topSales[0]?.tokenId} @ ${topSales[0]?.priceEth} ETH`);
