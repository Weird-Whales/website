#!/usr/bin/env node
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TRAITS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "utils/all-traits.json"), "utf8"),
);

const BACKGROUNDS = [
  "Baby Blue",
  "Cyan",
  "Orange",
  "Peach",
  "Pink",
  "Purple",
  "Red",
  "Yellow",
];

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

async function sampleCorners(buffer) {
  const img = sharp(buffer);
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixelAt = (x, y) => {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };
  // 4 corners - should all be background
  const corners = [
    pixelAt(0, 0),
    pixelAt(width - 1, 0),
    pixelAt(0, height - 1),
    pixelAt(width - 1, height - 1),
  ];
  // Average them (they should be identical for solid backgrounds)
  const r = Math.round(corners.reduce((s, c) => s + c[0], 0) / 4);
  const g = Math.round(corners.reduce((s, c) => s + c[1], 0) / 4);
  const b = Math.round(corners.reduce((s, c) => s + c[2], 0) / 4);
  return { rgb: [r, g, b], hex: rgbToHex(r, g, b), corners };
}

async function main() {
  const results = {};
  for (const bg of BACKGROUNDS) {
    const sample = TRAITS.find((t) => t.Background === bg);
    if (!sample) {
      console.log(`${bg}: NO SAMPLE FOUND`);
      continue;
    }
    process.stdout.write(`Sampling ${bg} (token #${sample.tokenId}) ... `);
    try {
      const buf = await fetchImage(sample.tokenId);
      const { hex, corners } = await sampleCorners(buf);
      const allMatch = corners.every(
        (c) =>
          c[0] === corners[0][0] &&
          c[1] === corners[0][1] &&
          c[2] === corners[0][2],
      );
      results[bg] = {
        tokenId: sample.tokenId,
        hex,
        consistent: allMatch,
      };
      console.log(`${hex}${allMatch ? "" : " (corners varied)"}`);
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
