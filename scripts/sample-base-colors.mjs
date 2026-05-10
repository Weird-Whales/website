#!/usr/bin/env node
/**
 * Samples the body color of one whale per Base type by reading several
 * pixels around the whale's belly (avoiding eye/mouth accessories) and
 * picking the most common one. The result is the dominant body color we
 * use in the mint-day replay grid.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TRAITS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "utils/all-traits.json"), "utf8"),
);

const BASES = ["Alien", "Ape", "Zombie", "Normal"];

const IMAGE_BASE =
  "https://github.com/Weird-Whales/images/raw/main/optimized-images/600x600/";

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b].map((n) => n.toString(16).padStart(2, "0").toUpperCase()).join("")
  );
}

async function fetchImage(tokenId) {
  const url = `${IMAGE_BASE}${tokenId}.png?raw=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url} (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

/** Pick the most common pixel color from a list of {r,g,b}. */
function modeColor(pixels) {
  const counts = new Map();
  for (const p of pixels) {
    const k = `${p[0]},${p[1]},${p[2]}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let bestKey = null;
  let bestCount = 0;
  for (const [k, c] of counts) {
    if (c > bestCount) {
      bestCount = c;
      bestKey = k;
    }
  }
  return bestKey ? bestKey.split(",").map(Number) : [0, 0, 0];
}

async function sampleBody(buffer, bgRgb) {
  const img = sharp(buffer);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixelAt = (x, y) => {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };
  // Walk the entire lower-middle region; reject background and near-black
  // (outline) pixels. The mode of what's left is the dominant body color.
  const samples = [];
  const x0 = Math.floor(width * 0.25);
  const x1 = Math.floor(width * 0.75);
  const y0 = Math.floor(height * 0.45);
  const y1 = Math.floor(height * 0.8);
  // Step by ~12 pixels (each NFT pixel is 25 image pixels at 600x600 / 24x24)
  const step = 12;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const px = pixelAt(x, y);
      const isBg =
        px[0] === bgRgb[0] && px[1] === bgRgb[1] && px[2] === bgRgb[2];
      const isOutline = px[0] < 30 && px[1] < 30 && px[2] < 30;
      if (!isBg && !isOutline) samples.push(px);
    }
  }
  return modeColor(samples);
}

async function getBackground(buffer) {
  const img = sharp(buffer);
  const { data } = await img.raw().toBuffer({ resolveWithObject: true });
  // Sample top-left corner.
  return [data[0], data[1], data[2]];
}

async function main() {
  const results = {};
  for (const base of BASES) {
    const sample = TRAITS.find((t) => t.Base === base);
    if (!sample) {
      console.log(`${base}: NO SAMPLE FOUND`);
      continue;
    }
    process.stdout.write(`Sampling ${base} (token #${sample.tokenId}) ... `);
    try {
      const buf = await fetchImage(sample.tokenId);
      const bg = await getBackground(buf);
      const body = await sampleBody(buf, bg);
      const hex = rgbToHex(body[0], body[1], body[2]);
      results[base] = { tokenId: sample.tokenId, hex, rgb: body };
      console.log(hex);
    } catch (err) {
      console.log("ERROR:", err.message);
    }
  }
  console.log("\n--- summary ---");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
