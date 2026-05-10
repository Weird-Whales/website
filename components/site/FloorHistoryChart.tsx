"use client";

import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { SmartTooltip } from "./SmartTooltip";
import { useCurrency } from "./CurrencyProvider";

export type SalesDay = {
  ts: number;
  sales: number;
  volume: number;
  min: number;
  max: number;
  avg: number;
};

type Range = "30d" | "90d" | "1y" | "all";

const RANGE_LABELS: Record<Range, string> = {
  "30d": "30D",
  "90d": "90D",
  "1y": "1Y",
  all: "ALL",
};

const DAY = 24 * 60 * 60 * 1000;

// Plot padding kept at module scope so referencing it inside useMemo
// doesn't require listing each field as a dep.
const PAD = { l: 44, r: 12, t: 12, b: 28 } as const;

const MONTHS_LONG = [
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

function fmtFullDate(ts: number) {
  const d = new Date(ts);
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function FloorHistoryChart({ days }: { days: SalesDay[] }) {
  const [range, setRange] = useState<Range>("all");
  const [hover, setHover] = useState<{
    idx: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { format } = useCurrency();

  // Compute "now" once on mount so render stays pure across re-renders.
  // Refreshes when the page reloads — fine for hour-grain ranges.
  const [now] = useState(() => Date.now());
  const filtered = useMemo(() => {
    if (range === "all" || days.length === 0) return days;
    const cutoff =
      now -
      (range === "30d" ? 30 * DAY : range === "90d" ? 90 * DAY : 365 * DAY);
    return days.filter((d) => d.ts >= cutoff);
  }, [days, range, now]);

  const stats = useMemo(() => {
    if (filtered.length === 0) {
      return { maxPrice: 1, maxVolume: 1, sales: 0, volume: 0, avg: 0, hi: 0, lo: 0 };
    }
    let maxPrice = 0;
    let maxVolume = 0;
    let totalVolume = 0;
    let totalSales = 0;
    let hi = 0;
    let lo = Infinity;
    for (const d of filtered) {
      if (d.avg > maxPrice) maxPrice = d.avg;
      if (d.max > maxPrice) maxPrice = d.max;
      if (d.volume > maxVolume) maxVolume = d.volume;
      totalVolume += d.volume;
      totalSales += d.sales;
      if (d.max > hi) hi = d.max;
      if (d.min < lo) lo = d.min;
    }
    return {
      maxPrice: maxPrice || 1,
      maxVolume: maxVolume || 1,
      sales: totalSales,
      volume: totalVolume,
      avg: totalSales ? totalVolume / totalSales : 0,
      hi,
      lo: lo === Infinity ? 0 : lo,
    };
  }, [filtered]);

  // Build SVG paths.
  const W = 1000;
  const H = 320;
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const pricePath = useMemo(() => {
    if (filtered.length === 0) return "";
    const parts: string[] = [];
    filtered.forEach((d, i) => {
      const x = PAD.l + (i / Math.max(1, filtered.length - 1)) * innerW;
      const y = PAD.t + innerH - (d.avg / stats.maxPrice) * innerH;
      parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    });
    return parts.join(" ");
  }, [filtered, innerW, innerH, stats.maxPrice]);

  const areaPath = useMemo(() => {
    if (!pricePath) return "";
    const x0 = PAD.l;
    const x1 = PAD.l + innerW;
    return `${pricePath} L ${x1.toFixed(1)} ${(PAD.t + innerH).toFixed(1)} L ${x0.toFixed(1)} ${(PAD.t + innerH).toFixed(1)} Z`;
  }, [pricePath, innerW, innerH]);

  const yTicks = useMemo(() => {
    const ticks = 4;
    const out: { v: number; y: number }[] = [];
    for (let i = 0; i <= ticks; i++) {
      const v = (stats.maxPrice * i) / ticks;
      const y = PAD.t + innerH - (v / stats.maxPrice) * innerH;
      out.push({ v, y });
    }
    return out;
  }, [stats.maxPrice, innerH]);

  const xLabels = useMemo(() => {
    if (filtered.length < 2) return [];
    const months = [
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
    const first = filtered[0];
    const last = filtered[filtered.length - 1];
    const mid = filtered[Math.floor(filtered.length / 2)];
    const fmt = (ts: number) => {
      const d = new Date(ts);
      const yy = String(d.getUTCFullYear()).slice(-2);
      return `${months[d.getUTCMonth()]} '${yy}`;
    };
    return [
      { x: PAD.l, label: fmt(first.ts) },
      { x: PAD.l + innerW / 2, label: fmt(mid.ts) },
      { x: PAD.l + innerW, label: fmt(last.ts) },
    ];
  }, [filtered, innerW]);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
            · Price history
          </div>
          <div className="text-sm text-muted-foreground">
            Daily average sale price in ETH.{" "}
            <span className="text-foreground/70">
              {stats.sales.toLocaleString()} sales
            </span>{" "}
            ·{" "}
            <span className="text-foreground/70">{format(stats.volume)}</span>{" "}
            volume in window
          </div>
        </div>
        <div className="flex gap-1">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`font-pixel text-[10px] tracking-[0.18em] uppercase rounded px-2.5 py-1.5 transition-colors ${
                range === r
                  ? "bg-[var(--ww-pink)] text-black"
                  : "bg-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat label="Avg sale" value={format(stats.avg)} accent="var(--ww-teal)" />
        <Stat label="High" value={format(stats.hi)} accent="var(--ww-yellow)" />
        <Stat label="Low" value={format(stats.lo)} accent="var(--ww-pink)" />
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
          onMouseMove={(e) => {
            if (filtered.length === 0 || !svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const xPx = e.clientX - rect.left;
            const xUser = (xPx / rect.width) * W;
            const inside = xUser - PAD.l;
            if (inside < 0 || inside > innerW) {
              setHover(null);
              return;
            }
            const ratio = inside / innerW;
            const idx = Math.max(
              0,
              Math.min(
                filtered.length - 1,
                Math.round(ratio * (filtered.length - 1)),
              ),
            );
            setHover({ idx, clientX: e.clientX, clientY: e.clientY });
          }}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="floor-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ww-pink)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--ww-pink)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={t.y}
                y2={t.y}
                stroke="white"
                strokeOpacity="0.05"
              />
              <text
                x={PAD.l - 6}
                y={t.y + 3}
                textAnchor="end"
                className="fill-muted-foreground"
                style={{ font: "9px ui-monospace, monospace" }}
              >
                {t.v.toFixed(2)}
              </text>
            </g>
          ))}

          {areaPath && (
            <motion.path
              d={areaPath}
              fill="url(#floor-area)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}
          {pricePath && (
            <motion.path
              d={pricePath}
              fill="none"
              stroke="var(--ww-pink)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          )}

          {xLabels.map((l, i) => (
            <text
              key={i}
              x={l.x}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{
                font: "9px ui-monospace, monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {l.label}
            </text>
          ))}

          {hover != null && filtered[hover.idx] && (
            <g>
              {(() => {
                const d = filtered[hover.idx];
                const x =
                  PAD.l +
                  (hover.idx / Math.max(1, filtered.length - 1)) * innerW;
                const y =
                  PAD.t + innerH - (d.avg / stats.maxPrice) * innerH;
                return (
                  <>
                    <line
                      x1={x}
                      x2={x}
                      y1={PAD.t}
                      y2={PAD.t + innerH}
                      stroke="white"
                      strokeOpacity="0.15"
                      strokeDasharray="2 3"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={4}
                      fill="var(--ww-pink)"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {hover != null && filtered[hover.idx] && (
          <SmartTooltip clientX={hover.clientX} clientY={hover.clientY}>
            <ChartTooltipContent day={filtered[hover.idx]} format={format} />
          </SmartTooltip>
        )}
      </div>
    </div>
  );
}

function ChartTooltipContent({
  day,
  format,
}: {
  day: SalesDay;
  format: (eth: number, opts?: { decimals?: number; showSymbol?: boolean }) => string;
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-black/90 backdrop-blur-md px-3 py-2 shadow-xl whitespace-nowrap">
      <div className="font-pixel text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
        {fmtFullDate(day.ts)}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
        <span className="text-muted-foreground">Avg</span>
        <span className="font-pixel tabular-nums text-[var(--ww-pink)]">
          {format(day.avg)}
        </span>
        <span className="text-muted-foreground">Range</span>
        <span className="font-pixel tabular-nums text-foreground">
          {format(day.min, { showSymbol: false })}–{format(day.max)}
        </span>
        <span className="text-muted-foreground">Sales</span>
        <span className="font-pixel tabular-nums text-foreground">
          {day.sales}
        </span>
        <span className="text-muted-foreground">Volume</span>
        <span className="font-pixel tabular-nums text-foreground">
          {format(day.volume)}
        </span>
      </div>
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
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div
        className="font-pixel text-[9px] tracking-[0.18em] uppercase mb-1"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="font-pixel text-base text-foreground">{value}</div>
    </div>
  );
}
