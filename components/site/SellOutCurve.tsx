"use client";

import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import type { MintBucket } from "./MintHeatmap";
import { SmartTooltip } from "./SmartTooltip";

const MONTHS = [
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

function fmtTime(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} · ${hh}:${mm} UTC`;
}

function fmtElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m`;
}

export function SellOutCurve({
  buckets,
  totalWhales,
}: {
  buckets: MintBucket[];
  totalWhales: number;
}) {
  const series = useMemo(() => {
    const out: Array<{ ts: number; cum: number; whalesMinted: number }> = [];
    let running = 0;
    for (const b of buckets) {
      running += b.whalesMinted ?? 0;
      out.push({ ts: b.ts, cum: running, whalesMinted: b.whalesMinted ?? 0 });
    }
    return out;
  }, [buckets]);

  const [hover, setHover] = useState<{
    idx: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  if (series.length < 2) return null;

  const W = 1000;
  const H = 240;
  const PADX = 16;
  const PADY = 12;

  const t0 = series[0].ts;
  const tN = series[series.length - 1].ts;
  const span = Math.max(tN - t0, 1);
  const max = Math.max(totalWhales, ...series.map((p) => p.cum));

  const x = (t: number) => PADX + ((t - t0) / span) * (W - PADX * 2);
  const y = (v: number) => H - PADY - (v / max) * (H - PADY * 2);

  const path =
    series
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${x(p.ts).toFixed(1)} ${y(p.cum).toFixed(1)}`,
      )
      .join(" ") +
    ` L ${x(tN).toFixed(1)} ${(H - PADY).toFixed(1)} L ${x(t0).toFixed(1)} ${(H - PADY).toFixed(1)} Z`;
  const linePath = series
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${x(p.ts).toFixed(1)} ${y(p.cum).toFixed(1)}`,
    )
    .join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
            · Sell-out curve
          </div>
          <div className="text-sm text-muted-foreground">
            Cumulative whales minted - flat for hours, then a vertical wall.
          </div>
        </div>
        <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-pink)]">
          {totalWhales.toLocaleString()} / {totalWhales.toLocaleString()}
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
          onMouseMove={(e) => {
            if (!svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const xPx = e.clientX - rect.left;
            const xUser = (xPx / rect.width) * W;
            const inside = xUser - PADX;
            const innerW = W - PADX * 2;
            if (inside < 0 || inside > innerW) {
              setHover(null);
              return;
            }
            const ratio = inside / innerW;
            const idx = Math.max(
              0,
              Math.min(
                series.length - 1,
                Math.round(ratio * (series.length - 1)),
              ),
            );
            setHover({ idx, clientX: e.clientX, clientY: e.clientY });
          }}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="ww-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ww-pink)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--ww-pink)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* gridlines */}
          {[0.25, 0.5, 0.75].map((p) => (
            <line
              key={p}
              x1={PADX}
              x2={W - PADX}
              y1={y(max * p)}
              y2={y(max * p)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          ))}
          {/* fill */}
          <motion.path
            d={path}
            fill="url(#ww-fill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          {/* line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="var(--ww-pink)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* hover crosshair */}
          {hover != null && series[hover.idx] && (
            <g>
              <line
                x1={x(series[hover.idx].ts)}
                x2={x(series[hover.idx].ts)}
                y1={PADY}
                y2={H - PADY}
                stroke="white"
                strokeOpacity="0.15"
                strokeDasharray="2 3"
              />
              <circle
                cx={x(series[hover.idx].ts)}
                cy={y(series[hover.idx].cum)}
                r={4}
                fill="var(--ww-pink)"
                stroke="black"
                strokeWidth={1.5}
              />
            </g>
          )}
        </svg>

        {hover != null && series[hover.idx] && (
          <SmartTooltip clientX={hover.clientX} clientY={hover.clientY}>
            <CurveTooltipContent
              point={series[hover.idx]}
              startTs={t0}
              total={totalWhales}
            />
          </SmartTooltip>
        )}
      </div>

      <div className="mt-2 flex justify-between font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
        <span>{new Date(t0).toUTCString().slice(5, 22)}</span>
        <span>{new Date(tN).toUTCString().slice(5, 22)}</span>
      </div>
    </div>
  );
}

function CurveTooltipContent({
  point,
  startTs,
  total,
}: {
  point: { ts: number; cum: number; whalesMinted: number };
  startTs: number;
  total: number;
}) {
  const pct = ((point.cum / total) * 100).toFixed(1);
  const elapsed = fmtElapsed(point.ts - startTs);
  return (
    <div className="rounded-lg border border-white/15 bg-black/90 backdrop-blur-md px-3 py-2 shadow-xl whitespace-nowrap">
      <div className="font-pixel text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
        {fmtTime(point.ts)}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
        <span className="text-muted-foreground">Minted</span>
        <span className="font-pixel tabular-nums text-[var(--ww-pink)]">
          {point.cum.toLocaleString()} ({pct}%)
        </span>
        <span className="text-muted-foreground">In bucket</span>
        <span className="font-pixel tabular-nums text-foreground">
          +{point.whalesMinted}
        </span>
        <span className="text-muted-foreground">T+ launch</span>
        <span className="font-pixel tabular-nums text-foreground">
          {elapsed}
        </span>
      </div>
    </div>
  );
}
