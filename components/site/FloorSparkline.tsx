import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getMergedSalesHistory } from "@/lib/sales-history-merged";

const DAY = 24 * 60 * 60 * 1000;

export async function FloorSparkline({ days = 90 }: { days?: number }) {
  const merged = await getMergedSalesHistory();
  // Server component runs once per request; Date.now() is the request time.
  // eslint-disable-next-line react-hooks/purity
  const cutoff = Date.now() - days * DAY;
  const series = merged.days
    .filter((d) => d.ts >= cutoff)
    .map((d) => ({ ts: d.ts, v: d.avg }));

  if (series.length < 2) return null;

  const W = 220;
  const H = 40;
  const PAD = 2;
  let max = 0;
  let min = Infinity;
  for (const p of series) {
    if (p.v > max) max = p.v;
    if (p.v < min) min = p.v;
  }
  const range = Math.max(0.0001, max - min);

  const points = series.map((p, i) => {
    const x = PAD + (i / (series.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (p.v - min) / range) * (H - PAD * 2);
    return [x, y] as const;
  });
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${path} L ${points[points.length - 1][0].toFixed(1)} ${(H - PAD).toFixed(1)} L ${points[0][0].toFixed(1)} ${(H - PAD).toFixed(1)} Z`;

  const first = series[0].v;
  const last = series[series.length - 1].v;
  const change = ((last - first) / first) * 100;
  const up = change >= 0;
  const color = up ? "var(--ww-teal)" : "var(--ww-pink)";

  return (
    <Link
      href="/stats"
      className="group inline-flex items-center gap-3 text-xs"
      aria-label="See full price history on the stats page"
    >
      <div className="flex flex-col">
        <span className="font-pixel text-[9px] tracking-[0.18em] uppercase text-muted-foreground">
          Avg sale · 90d
        </span>
        <span className="font-pixel text-[11px] tabular-nums" style={{ color }}>
          {up ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
        </span>
      </div>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="spark-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#spark-area)" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Link>
  );
}
