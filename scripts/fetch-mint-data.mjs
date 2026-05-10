#!/usr/bin/env node
/**
 * Fetches every transaction to the Weird Whales contract from Etherscan,
 * identifies the launch-window mint activity, and writes a summary to
 * utils/mint-data.json for the story page.
 *
 * Requires ETHERSCAN_API_KEY in .env.local. Free key from etherscan.io/apis.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Prefer process.env (Vercel build / CI), fall back to .env.local for local dev.
let KEY = process.env.ETHERSCAN_API_KEY;
if (!KEY) {
  try {
    const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
    KEY = env.match(/ETHERSCAN_API_KEY=(.+)/)?.[1]?.trim();
  } catch {
    // .env.local not present — fine on Vercel where env vars come from the dashboard.
  }
}
if (!KEY) {
  console.error(
    "Missing ETHERSCAN_API_KEY (env or .env.local). Get a free key at https://etherscan.io/apis",
  );
  process.exit(1);
}

const CONTRACT = "0x96Ed81c7F4406Eff359E27BfF6325DC3c9e042BD";
const BASE = "https://api.etherscan.io/v2/api";
const CHAIN = "1"; // Ethereum mainnet

async function fetchPage(startBlock, endBlock = 99999999, page = 1) {
  const url = new URL(BASE);
  url.searchParams.set("chainid", CHAIN);
  url.searchParams.set("module", "account");
  url.searchParams.set("action", "txlist");
  url.searchParams.set("address", CONTRACT);
  url.searchParams.set("startblock", String(startBlock));
  url.searchParams.set("endblock", String(endBlock));
  url.searchParams.set("page", String(page));
  url.searchParams.set("offset", "10000");
  url.searchParams.set("sort", "asc");
  url.searchParams.set("apikey", KEY);
  const res = await fetch(url);
  const j = await res.json();
  if (j.status === "0" && j.message !== "No transactions found") {
    throw new Error(`Etherscan: ${j.message} - ${j.result}`);
  }
  return j.result || [];
}

console.log("Fetching txs to contract...");
const all = [];
let startBlock = 0;
while (true) {
  const batch = await fetchPage(startBlock);
  if (!batch.length) break;
  all.push(...batch);
  process.stdout.write(`  +${batch.length} (total ${all.length})\n`);
  if (batch.length < 10000) break;
  // continue from the last block we saw to avoid pagination cap
  startBlock = Number(batch[batch.length - 1].blockNumber) + 1;
  await new Promise((r) => setTimeout(r, 250));
}
console.log(`Fetched ${all.length} total transactions.`);

// Heuristic: identify mint transactions.
// Mints have a non-zero value (paying ETH) OR call mint*() functions.
// Function selector for mintTokens(uint256) is 0xa0712d68 (commonly used).
// We'll identify by: tx that is to the contract AND value > 0 OR input matches mint sig.
const MINT_SIG_HINTS = [
  "mint",
  "summon",
  "claim",
];

function looksLikeMint(tx) {
  const fn = (tx.functionName || "").toLowerCase();
  if (MINT_SIG_HINTS.some((h) => fn.includes(h))) return true;
  // Fall back: any tx that sent ETH to the contract during the launch window
  if (tx.value && BigInt(tx.value) > 0n) return true;
  return false;
}

const mints = all.filter(looksLikeMint);
const success = mints.filter(
  (t) => t.txreceipt_status === "1" && t.isError === "0",
);
const failed = mints.filter(
  (t) => t.txreceipt_status === "0" || t.isError === "1",
);
console.log(`Identified ${mints.length} mint attempts:`);
console.log(`  ${success.length} successful`);
console.log(`  ${failed.length} failed/reverted`);

// Bucket by 5-minute windows over the launch period
const BUCKET_MS = 5 * 60 * 1000;
const buckets = new Map();
function bucketKey(tx) {
  const t = Number(tx.timeStamp) * 1000;
  return Math.floor(t / BUCKET_MS) * BUCKET_MS;
}

let successValueWei = 0n;
let failedValueWei = 0n;
let failedFeesWei = 0n;

for (const tx of mints) {
  const k = bucketKey(tx);
  let b = buckets.get(k);
  if (!b) {
    b = { ts: k, success: 0, failed: 0, valueWei: 0n, gasUsed: 0n, fees: 0n };
    buckets.set(k, b);
  }
  const isSuccess = tx.txreceipt_status === "1" && tx.isError === "0";
  if (isSuccess) b.success++;
  else b.failed++;
  const value = tx.value ? BigInt(tx.value) : 0n;
  if (tx.value) b.valueWei += value;
  const gas = BigInt(tx.gasUsed || 0);
  const gasPrice = BigInt(tx.gasPrice || 0);
  b.gasUsed += gas;
  b.fees += gas * gasPrice;

  if (isSuccess) successValueWei += value;
  else {
    failedValueWei += value;
    failedFeesWei += gas * gasPrice;
  }
}

// ----- Pull ERC-721 mint Transfer events for whale-level accuracy -----
async function fetchTokenTxPage(startBlock, endBlock = 99999999) {
  const url = new URL(BASE);
  url.searchParams.set("chainid", CHAIN);
  url.searchParams.set("module", "account");
  url.searchParams.set("action", "tokennfttx");
  url.searchParams.set("contractaddress", CONTRACT);
  url.searchParams.set("startblock", String(startBlock));
  url.searchParams.set("endblock", String(endBlock));
  url.searchParams.set("page", "1");
  url.searchParams.set("offset", "10000");
  url.searchParams.set("sort", "asc");
  url.searchParams.set("apikey", KEY);
  const res = await fetch(url);
  const j = await res.json();
  if (j.status === "0" && j.message !== "No transactions found") {
    throw new Error(`Etherscan tokennfttx: ${j.message} - ${j.result}`);
  }
  return j.result || [];
}

console.log("\nFetching ERC-721 transfers...");
const transfers = [];
let tStart = 0;
while (true) {
  const batch = await fetchTokenTxPage(tStart);
  if (!batch.length) break;
  transfers.push(...batch);
  process.stdout.write(`  +${batch.length} (total ${transfers.length})\n`);
  if (batch.length < 10000) break;
  tStart = Number(batch[batch.length - 1].blockNumber) + 1;
  await new Promise((r) => setTimeout(r, 250));
}
const ZERO = "0x0000000000000000000000000000000000000000";
const mintEvents = transfers.filter((t) => (t.from || "").toLowerCase() === ZERO);
console.log(`Found ${mintEvents.length} mint events (whales transferred from 0x0).`);

// Per-bucket whale counts (each Transfer = one whale minted)
const whalesByBucket = new Map();
for (const ev of mintEvents) {
  const k = Math.floor((Number(ev.timeStamp) * 1000) / BUCKET_MS) * BUCKET_MS;
  whalesByBucket.set(k, (whalesByBucket.get(k) ?? 0) + 1);
}

// Per-wallet successful mint counts (whales actually received at mint)
const minterCounts = new Map();
for (const ev of mintEvents) {
  const to = (ev.to || "").toLowerCase();
  if (!to) continue;
  minterCounts.set(to, (minterCounts.get(to) ?? 0) + 1);
}
const topMinters = Array.from(minterCounts.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([address, count]) => ({ address, whaleCount: count }));

// Cumulative timeline of whales minted (sorted by time)
const sortedMintEvents = mintEvents
  .slice()
  .sort((a, b) => Number(a.timeStamp) - Number(b.timeStamp));
const totalWhales = sortedMintEvents.length;

// Compute milestone timestamps: when did the Nth whale get minted?
function whaleAtIdxTs(idx) {
  const ev = sortedMintEvents[Math.min(idx, sortedMintEvents.length - 1)];
  return ev ? Number(ev.timeStamp) * 1000 : null;
}
const PCTS = [10, 25, 50, 75, 90, 100];
const milestones = PCTS.map((pct) => ({
  pct,
  whales: Math.floor((pct / 100) * totalWhales),
  ts: whaleAtIdxTs(Math.floor((pct / 100) * totalWhales) - 1),
}));

// First / Last / First-revert tx hashes
const firstSuccessTx = success.length
  ? success.slice().sort((a, b) => Number(a.timeStamp) - Number(b.timeStamp))[0]
  : null;
const lastSuccessTx = success.length
  ? success.slice().sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))[0]
  : null;
const firstRevertTx = failed.length
  ? failed.slice().sort((a, b) => Number(a.timeStamp) - Number(b.timeStamp))[0]
  : null;
function txCard(tx) {
  if (!tx) return null;
  return {
    hash: tx.hash,
    timestamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
    from: (tx.from || "").toLowerCase(),
    blockNumber: Number(tx.blockNumber),
  };
}

const sortedBuckets = Array.from(buckets.values()).sort((a, b) => a.ts - b.ts);

// Trim trailing post-launch buckets that have very little activity (<2 attempts)
let endIdx = sortedBuckets.length;
while (
  endIdx > 0 &&
  sortedBuckets[endIdx - 1].success + sortedBuckets[endIdx - 1].failed < 2
) {
  endIdx--;
}
const launch = sortedBuckets.slice(0, Math.max(endIdx, 1));

// Stats
const totalFeesEth = launch.reduce((s, b) => s + Number(b.fees), 0) / 1e18;
const totalValueEth =
  launch.reduce((s, b) => s + Number(b.valueWei), 0) / 1e18;
const peak = launch.reduce(
  (best, b) =>
    b.success + b.failed > best.success + best.failed ? b : best,
  launch[0] || { success: 0, failed: 0, ts: 0 },
);
const uniqueMinters = new Set(
  success.map((t) => (t.from || "").toLowerCase()),
).size;

const summary = {
  contract: CONTRACT,
  generatedAt: new Date().toISOString(),
  totalTxs: all.length,
  totalMintAttempts: mints.length,
  successfulMints: success.length,
  failedMints: failed.length,
  uniqueMinters,
  totalEthPaid: totalValueEth,
  totalFeesPaid: totalFeesEth,
  successEthEarned: Number(successValueWei) / 1e18,
  failedEthRefunded: Number(failedValueWei) / 1e18,
  failedGasBurnedByBidders: Number(failedFeesWei) / 1e18,
  peak: {
    ts: peak.ts,
    successInBucket: peak.success,
    failedInBucket: peak.failed,
    bucketMs: BUCKET_MS,
  },
  buckets: launch.map((b) => ({
    ts: b.ts,
    success: b.success,
    failed: b.failed,
    feesEth: Number(b.fees) / 1e18,
    whalesMinted: whalesByBucket.get(b.ts) ?? 0,
  })),
  totalWhalesMinted: totalWhales,
  milestones,
  topMinters,
  firstMintTx: txCard(firstSuccessTx),
  lastMintTx: txCard(lastSuccessTx),
  firstRevertTx: txCard(firstRevertTx),
  windowStart: launch[0]?.ts ?? null,
  windowEnd: launch[launch.length - 1]?.ts ?? null,
};

const outPath = path.join(ROOT, "utils/mint-data.json");
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
console.log(`\nWrote ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);

// Per-mint timeline (one row per minted whale, sorted by time) - used by
// the mint-day replay UI. Kept in its own file so the main mint-data.json
// stays small for components that only need the aggregates.
//
// We attribute each tx's ETH value evenly across the whales it minted, so
// summing valueEth over a time window matches the real running revenue.
const mintsPerTx = new Map();
for (const ev of sortedMintEvents) {
  const k = ev.hash;
  mintsPerTx.set(k, (mintsPerTx.get(k) ?? 0) + 1);
}
const valueByTxHash = new Map();
for (const tx of success) {
  if (tx.value) valueByTxHash.set(tx.hash, Number(tx.value) / 1e18);
}
const timeline = sortedMintEvents.map((ev) => {
  const txValue = valueByTxHash.get(ev.hash) ?? 0;
  const txCount = mintsPerTx.get(ev.hash) ?? 1;
  return {
    tokenId: Number(ev.tokenID),
    ts: Number(ev.timeStamp) * 1000,
    txHash: ev.hash,
    minter: (ev.to || "").toLowerCase(),
    valueEth: Number((txValue / txCount).toFixed(6)),
  };
});
const timelinePath = path.join(ROOT, "utils/mint-timeline.json");
fs.writeFileSync(
  timelinePath,
  JSON.stringify({ generatedAt: new Date().toISOString(), mints: timeline }),
);
console.log(
  `Wrote ${timelinePath} (${(fs.statSync(timelinePath).size / 1024).toFixed(1)} KB · ${timeline.length} mints)`,
);
console.log(`\nLaunch window: ${new Date(summary.windowStart).toISOString()}`);
console.log(`            → ${new Date(summary.windowEnd).toISOString()}`);
console.log(`Peak:         ${peak.success + peak.failed} txs in 5 min`);
console.log(`              (${peak.success} ✓ / ${peak.failed} ✗)`);
console.log(`Unique minters: ${uniqueMinters}`);
console.log(`Total fees:   ${totalFeesEth.toFixed(2)} ETH`);
console.log(`\n--- value breakdown ---`);
console.log(`Earned (successful mints): ${(Number(successValueWei) / 1e18).toFixed(3)} ETH`);
console.log(`Refunded (failed txs):     ${(Number(failedValueWei) / 1e18).toFixed(3)} ETH ← would've earned if supply existed`);
console.log(`Gas burned by bidders on failed txs: ${(Number(failedFeesWei) / 1e18).toFixed(3)} ETH`);
console.log(`\n--- additional facts ---`);
console.log(`Total whales minted (Transfer events): ${totalWhales}`);
console.log(`Top minter: ${topMinters[0]?.address ?? "n/a"} → ${topMinters[0]?.whaleCount ?? 0} whales`);
console.log(`First mint tx:  ${firstSuccessTx?.hash} at ${new Date(Number(firstSuccessTx?.timeStamp) * 1000).toISOString()}`);
console.log(`Last mint tx:   ${lastSuccessTx?.hash} at ${new Date(Number(lastSuccessTx?.timeStamp) * 1000).toISOString()}`);
console.log(`First revert:   ${firstRevertTx?.hash ?? "none"}`);
console.log(`Milestones:`);
for (const m of milestones) {
  if (m.ts) {
    console.log(`  ${m.pct}% (${m.whales} whales) @ ${new Date(m.ts).toISOString()}`);
  }
}
