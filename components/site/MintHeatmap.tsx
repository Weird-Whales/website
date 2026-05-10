"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { SmartTooltip } from "./SmartTooltip";
import { useCurrency } from "./CurrencyProvider";

const MONTHS_HM = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function fmtBucketTime(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${MONTHS_HM[d.getUTCMonth()]} ${d.getUTCDate()} · ${hh}:${mm} UTC`;
}

export type MintBucket = {
  ts: number;
  success: number;
  failed: number;
  feesEth: number;
  whalesMinted?: number;
};

export type Milestone = {
  pct: number;
  whales: number;
  ts: number | null;
};

export type TopMinter = {
  address: string;
  whaleCount: number;
};

export type LaunchTx = {
  hash: string;
  timestamp: string;
  from: string;
  blockNumber: number;
};

export type MintData = {
  totalTxs: number;
  totalMintAttempts: number;
  successfulMints: number;
  failedMints: number;
  uniqueMinters: number;
  totalEthPaid: number;
  totalFeesPaid: number;
  successEthEarned?: number;
  failedEthRefunded?: number;
  failedGasBurnedByBidders?: number;
  peak: { ts: number; successInBucket: number; failedInBucket: number };
  buckets: MintBucket[];
  windowStart: number | null;
  windowEnd: number | null;
  totalWhalesMinted?: number;
  milestones?: Milestone[];
  topMinters?: TopMinter[];
  firstMintTx?: LaunchTx | null;
  lastMintTx?: LaunchTx | null;
  firstRevertTx?: LaunchTx | null;
};

export function MintHeatmap({ data }: { data: MintData }) {
  const { buckets, peak } = data;
  const maxBucket = useMemo(
    () => buckets.reduce((m, b) => Math.max(m, b.success + b.failed), 1),
    [buckets],
  );
  const [hover, setHover] = useState<{
    idx: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const { format, currency } = useCurrency();

  const start = buckets[0]?.ts ?? 0;
  const end = buckets[buckets.length - 1]?.ts ?? 0;
  const durationHours = (end - start) / (1000 * 60 * 60);

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Successful txs"
          value={data.successfulMints.toLocaleString()}
          accent="var(--ww-teal)"
        />
        <Stat
          label="Reverted txs"
          value={data.failedMints.toLocaleString()}
          accent="var(--ww-pink)"
        />
        <Stat
          label="Unique minters"
          value={data.uniqueMinters.toLocaleString()}
          accent="var(--ww-purple)"
        />
        <Stat
          label={`Fees burned${currency === "ETH" ? " (Ξ)" : ""}`}
          value={format(data.totalFeesPaid, { showSymbol: currency !== "ETH" })}
          accent="var(--ww-yellow)"
        />
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
              · Mint surge (5-min buckets)
            </div>
            <div className="flex items-baseline gap-3 text-sm text-muted-foreground">
              <span>
                Peak:{" "}
                <span className="font-pixel text-foreground">
                  {peak.successInBucket + peak.failedInBucket}
                </span>{" "}
                attempts in 5 min
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">
                {durationHours.toFixed(1)}h window
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <LegendDot color="var(--ww-teal)" label="Success" />
            <LegendDot color="var(--ww-pink)" label="Failed" />
          </div>
        </div>

        <div
          className="relative h-56 w-full overflow-x-auto overflow-y-hidden"
          onMouseLeave={() => setHover(null)}
        >
          <div
            className="flex h-full items-end gap-[2px] pr-1"
            style={{
              minWidth: `${Math.max(buckets.length * 6, 100)}px`,
            }}
          >
            {buckets.map((b, i) => {
              const total = b.success + b.failed;
              const heightPct = (total / maxBucket) * 100;
              const failPct = total ? (b.failed / total) * 100 : 0;
              const isHovered = hover?.idx === i;
              return (
                <motion.div
                  key={b.ts}
                  initial={{ height: 0, opacity: 0 }}
                  whileInView={{ height: `${heightPct}%`, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.005 }}
                  onMouseEnter={(e) => {
                    const r = (
                      e.currentTarget as HTMLDivElement
                    ).getBoundingClientRect();
                    setHover({
                      idx: i,
                      clientX: r.left + r.width / 2,
                      clientY: r.top,
                    });
                  }}
                  className="relative w-full min-w-[3px] flex-1 rounded-sm overflow-hidden bg-[var(--ww-teal)]"
                  style={{
                    outline: isHovered ? "1px solid white" : "none",
                    outlineOffset: isHovered ? "1px" : "0",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 bg-[var(--ww-pink)]"
                    style={{ height: `${failPct}%` }}
                  />
                </motion.div>
              );
            })}
          </div>

          {hover != null && buckets[hover.idx] && (
            <SmartTooltip clientX={hover.clientX} clientY={hover.clientY}>
              <HeatmapTooltipContent bucket={buckets[hover.idx]} />
            </SmartTooltip>
          )}
        </div>

        <div className="mt-3 flex justify-between text-[10px] font-pixel tracking-[0.18em] uppercase text-muted-foreground">
          <span>{start ? new Date(start).toUTCString().slice(5, 22) : ""}</span>
          <span>{end ? new Date(end).toUTCString().slice(5, 22) : ""}</span>
        </div>
      </div>

      {/* What-if value callout */}
      {data.successEthEarned != null && data.failedEthRefunded != null && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--ww-teal)]/30 bg-[var(--ww-teal)]/5 p-4">
            <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-teal)] mb-2">
              Earned
            </div>
            <div className="font-pixel text-2xl text-foreground">
              {format(data.successEthEarned)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              from successful mints
            </div>
          </div>
          <div className="rounded-xl border border-[var(--ww-pink)]/30 bg-[var(--ww-pink)]/5 p-4">
            <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-pink)] mb-2">
              What got refunded
            </div>
            <div className="font-pixel text-2xl text-foreground">
              +{format(data.failedEthRefunded)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              auto-returned to bidders when their tx reverted
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeatmapTooltipContent({ bucket }: { bucket: MintBucket }) {
  const totalAttempts = bucket.success + bucket.failed;
  return (
    <div className="rounded-lg border border-white/15 bg-black/90 backdrop-blur-md px-3 py-2 shadow-xl whitespace-nowrap">
      <div className="font-pixel text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
        {fmtBucketTime(bucket.ts)}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-pixel text-[11px] tabular-nums text-[var(--ww-teal)]">
          {bucket.success} ✓
        </span>
        <span className="font-pixel text-[11px] tabular-nums text-[var(--ww-pink)]">
          {bucket.failed} ✗
        </span>
        <span className="font-pixel text-[10px] tabular-nums text-muted-foreground">
          {totalAttempts} total
        </span>
      </div>
      {bucket.whalesMinted != null && bucket.whalesMinted > 0 && (
        <div className="mt-1 font-pixel text-[10px] tabular-nums text-foreground/70">
          {bucket.whalesMinted} whale{bucket.whalesMinted === 1 ? "" : "s"} minted
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm">
      <div
        className="font-pixel text-[10px] tracking-[0.18em] uppercase mb-2"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="font-pixel text-xl text-foreground">{value}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
