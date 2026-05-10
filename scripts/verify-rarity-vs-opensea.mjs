#!/usr/bin/env node
/**
 * Verifies that the local OpenRarity computation in utils/rarity.ts matches
 * OpenSea's official rank for a fresh sample of whales. Run after any change
 * to the rarity formula or the underlying trait data.
 *
 * Usage: node scripts/verify-rarity-vs-opensea.mjs [sample-size]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const all = JSON.parse(
  fs.readFileSync(path.join(ROOT, "utils/all-traits.json"), "utf8"),
);
const KEY = fs
  .readFileSync(path.join(ROOT, ".env.local"), "utf8")
  .match(/OPENSEA_API_KEY=(.+)/)[1]
  .trim();

const SAMPLE_SIZE = Number(process.argv[2] ?? 50);
const TOTAL = all.length;
const cats = ["Background", "Base", "Eye Accessory", "Headgear", "Mouth Accessory"];

const NULL = new Set(["None", "none", "null", "Null", ""]);
const present = (v) => !NULL.has(v);

// Mirror the formula in utils/rarity.ts
const freq = Object.fromEntries(cats.map((c) => [c, {}]));
const traitCountFreq = {};
for (const w of all) {
  let n = 0;
  for (const c of cats) {
    freq[c][w[c]] = (freq[c][w[c]] || 0) + 1;
    if (present(w[c])) n++;
  }
  traitCountFreq[n] = (traitCountFreq[n] || 0) + 1;
}
const ic = (count) => Math.log2(TOTAL / count);
const score = (w) => {
  let s = 0;
  let n = 0;
  for (const c of cats) {
    s += ic(freq[c][w[c]]);
    if (present(w[c])) n++;
  }
  return s + ic(traitCountFreq[n]);
};

const sortedLocal = all
  .map((w) => ({ id: w.tokenId, s: score(w) }))
  .sort((a, b) => b.s - a.s);
const localRank = new Map();
sortedLocal.forEach((w, i) => localRank.set(w.id, i + 1));

const ids = new Set();
while (ids.size < SAMPLE_SIZE) ids.add(Math.floor(Math.random() * TOTAL));

console.log(`Comparing ${ids.size} random whales against OpenSea live API...`);

const diffs = [];
let exact = 0;
let n = 0;
for (const id of ids) {
  try {
    const r = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/contract/0x96ed81c7f4406eff359e27bff6325dc3c9e042bd/nfts/${id}`,
      { headers: { "X-API-KEY": KEY } },
    );
    const j = await r.json();
    const os = j.nft?.rarity?.rank;
    if (!os) continue;
    const local = localRank.get(id);
    const d = local - os;
    diffs.push(Math.abs(d));
    if (d === 0) exact++;
    if (++n % 10 === 0) process.stdout.write(`${n}/${ids.size}... `);
    await new Promise((r) => setTimeout(r, 200));
  } catch {
    // ignore transient failures
  }
}
console.log();

if (!diffs.length) {
  console.log("No comparable ranks fetched.");
  process.exit(1);
}
diffs.sort((a, b) => a - b);
const sum = diffs.reduce((s, d) => s + d, 0);
console.log(`\nResults over ${diffs.length} whales:`);
console.log(`  Exact match : ${exact} (${((exact / diffs.length) * 100).toFixed(0)}%)`);
console.log(`  Mean |diff| : ${(sum / diffs.length).toFixed(2)}`);
console.log(`  Median      : ${diffs[Math.floor(diffs.length / 2)]}`);
console.log(`  Max         : ${diffs[diffs.length - 1]}`);
