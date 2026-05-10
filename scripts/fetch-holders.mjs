#!/usr/bin/env node
/**
 * Walks every ERC-721 transfer for the Weird Whales contract from Etherscan,
 * derives the current owner of each token, and writes utils/holders.json with:
 *   - currentOwners: map of tokenId → address
 *   - distribution: holders bucketed by how many they hold
 *   - topHolders: top 25 wallets by whale count
 *   - diamondHands: wallets that minted at launch AND still hold ≥1
 *   - mintCount, currentHolderCount, holdersAtMintCount
 *
 * Requires ETHERSCAN_API_KEY in .env.local.
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
  console.error("Missing ETHERSCAN_API_KEY (env or .env.local)");
  process.exit(1);
}

const CONTRACT = "0x96Ed81c7F4406Eff359E27BfF6325DC3c9e042BD";
const BASE = "https://api.etherscan.io/v2/api";
const CHAIN = "1";
const ZERO = "0x0000000000000000000000000000000000000000";
const TOTAL_SUPPLY = 3350;

async function fetchPage(startBlock) {
  const url = new URL(BASE);
  url.searchParams.set("chainid", CHAIN);
  url.searchParams.set("module", "account");
  url.searchParams.set("action", "tokennfttx");
  url.searchParams.set("contractaddress", CONTRACT);
  url.searchParams.set("startblock", String(startBlock));
  url.searchParams.set("endblock", "99999999");
  url.searchParams.set("page", "1");
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

console.log("Fetching all ERC-721 transfers…");
const transfers = [];
let start = 0;
while (true) {
  const batch = await fetchPage(start);
  if (!batch.length) break;
  transfers.push(...batch);
  process.stdout.write(`  +${batch.length} (total ${transfers.length})\n`);
  if (batch.length < 10000) break;
  start = Number(batch[batch.length - 1].blockNumber) + 1;
  await new Promise((r) => setTimeout(r, 250));
}
console.log(`Fetched ${transfers.length} transfers.`);

// Latest owner per tokenId.
transfers.sort((a, b) => {
  const bn = Number(a.blockNumber) - Number(b.blockNumber);
  if (bn !== 0) return bn;
  return Number(a.transactionIndex ?? 0) - Number(b.transactionIndex ?? 0);
});

const owners = new Map(); // tokenId → lowercase address
const minters = new Map(); // tokenId → minter (first non-zero recipient)
const lastTransfer = new Map(); // tokenId → ts (ms) of last transfer
for (const t of transfers) {
  const id = Number(t.tokenID);
  const to = (t.to || "").toLowerCase();
  const from = (t.from || "").toLowerCase();
  const ts = Number(t.timeStamp) * 1000;
  owners.set(id, to);
  lastTransfer.set(id, ts);
  if (from === ZERO && !minters.has(id)) minters.set(id, to);
}

// Anyone holding at zero address (burns) - exclude from distribution.
const liveOwners = new Map();
for (const [id, addr] of owners) {
  if (addr && addr !== ZERO) liveOwners.set(id, addr);
}

// Wallet → array of tokenIds.
const walletWhales = new Map();
for (const [id, addr] of liveOwners) {
  let arr = walletWhales.get(addr);
  if (!arr) {
    arr = [];
    walletWhales.set(addr, arr);
  }
  arr.push(id);
}

// Distribution buckets.
const buckets = { "1": 0, "2-5": 0, "6-10": 0, "11-25": 0, "26+": 0 };
for (const arr of walletWhales.values()) {
  const n = arr.length;
  if (n === 1) buckets["1"]++;
  else if (n <= 5) buckets["2-5"]++;
  else if (n <= 10) buckets["6-10"]++;
  else if (n <= 25) buckets["11-25"]++;
  else buckets["26+"]++;
}

// Top holders.
const topHolders = Array.from(walletWhales.entries())
  .map(([address, ids]) => ({ address, count: ids.length }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 25);

// Holders at mint (unique minter addresses).
const minterAddrs = new Set();
for (const m of minters.values()) {
  if (m && m !== ZERO) minterAddrs.add(m);
}

// Diamond hands: wallets that minted ≥1 AND still hold ≥1 of the SAME tokens.
let diamondHands = 0;
let stillHeldFromMint = 0;
const diamondWallets = new Set();
for (const [id, mintAddr] of minters) {
  const cur = liveOwners.get(id);
  if (cur && cur === mintAddr) {
    stillHeldFromMint++;
    diamondWallets.add(mintAddr);
  }
}
diamondHands = diamondWallets.size;

// Burned count.
const burned = TOTAL_SUPPLY - liveOwners.size;

// Last 30d activity (transfers count) - just informational.
const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
let last30Transfers = 0;
let last7Transfers = 0;
for (const t of transfers) {
  const ts = Number(t.timeStamp) * 1000;
  if (NOW - ts <= 30 * DAY) last30Transfers++;
  if (NOW - ts <= 7 * DAY) last7Transfers++;
}

const out = {
  generatedAt: new Date().toISOString(),
  totalSupply: TOTAL_SUPPLY,
  burned,
  currentHolderCount: walletWhales.size,
  mintHolderCount: minterAddrs.size,
  stillHeldFromMintCount: stillHeldFromMint,
  diamondHandsCount: diamondHands,
  distribution: buckets,
  topHolders,
  recentActivity: {
    last7Transfers,
    last30Transfers,
  },
};

const outPath = path.join(ROOT, "utils/holders.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`\nWrote ${outPath}`);
console.log(`Current holders: ${walletWhales.size}`);
console.log(`Holders at mint: ${minterAddrs.size}`);
console.log(`Diamond hands (minted + still hold same token): ${diamondHands} wallets, ${stillHeldFromMint} whales`);
console.log(`Burned: ${burned}`);
console.log(`Distribution:`, buckets);
console.log(`Top holder: ${topHolders[0]?.address} → ${topHolders[0]?.count} whales`);
