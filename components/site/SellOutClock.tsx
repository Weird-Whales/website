import type { Milestone } from "./MintHeatmap";

const ACCENTS: Record<number, string> = {
  10: "var(--ww-sky)",
  25: "var(--ww-teal)",
  50: "var(--ww-yellow)",
  75: "var(--ww-orange)",
  90: "var(--ww-pink)",
  100: "var(--ww-purple)",
};

function shortTime(iso: string) {
  // 2021-07-19T21:27:36 → 21:27 UTC
  return iso.slice(11, 16) + " UTC";
}

function deltaFromStart(ts: number, start: number) {
  const diffSec = Math.max(0, Math.floor((ts - start) / 1000));
  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  if (h > 0) return `+${h}h ${m}m`;
  const s = diffSec % 60;
  if (m > 0) return `+${m}m ${s}s`;
  return `+${s}s`;
}

export function SellOutClock({
  milestones,
  windowStart,
}: {
  milestones: Milestone[];
  windowStart: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
        · Sell-out clock
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {milestones.map((m) => {
          const accent = ACCENTS[m.pct] ?? "var(--ww-pink)";
          if (!m.ts) return null;
          return (
            <div
              key={m.pct}
              className="relative rounded-lg border border-white/10 bg-black/30 p-3"
            >
              <div
                className="absolute top-0 left-0 h-1 rounded-t-lg w-full"
                style={{ background: accent }}
              />
              <div
                className="font-pixel text-2xl tabular-nums"
                style={{ color: accent }}
              >
                {m.pct}%
              </div>
              <div className="mt-1 font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                {m.whales.toLocaleString()} whales
              </div>
              <div className="mt-2 font-mono text-[11px] text-foreground">
                {shortTime(new Date(m.ts).toISOString())}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {deltaFromStart(m.ts, windowStart)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
