import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type HolderData = {
  totalSupply: number;
  burned: number;
  currentHolderCount: number;
  mintHolderCount: number;
  stillHeldFromMintCount: number;
  diamondHandsCount: number;
  distribution: Record<string, number>;
  topHolders: Array<{ address: string; count: number }>;
  recentActivity: { last7Transfers: number; last30Transfers: number };
};

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

const ACCENTS = [
  "var(--ww-pink)",
  "var(--ww-yellow)",
  "var(--ww-teal)",
  "var(--ww-purple)",
  "var(--ww-orange)",
];

export function HolderSnapshot({ data }: { data: HolderData }) {
  const dist = [
    { label: "1 whale", value: data.distribution["1"] ?? 0, color: "var(--ww-sky)" },
    { label: "2–5", value: data.distribution["2-5"] ?? 0, color: "var(--ww-teal)" },
    { label: "6–10", value: data.distribution["6-10"] ?? 0, color: "var(--ww-yellow)" },
    { label: "11–25", value: data.distribution["11-25"] ?? 0, color: "var(--ww-orange)" },
    { label: "26+", value: data.distribution["26+"] ?? 0, color: "var(--ww-pink)" },
  ];
  const totalDist = dist.reduce((s, d) => s + d.value, 0) || 1;
  const topHolders = data.topHolders.slice(0, 10);
  const max = topHolders[0]?.count ?? 1;

  const stillPct = (
    (data.stillHeldFromMintCount / data.totalSupply) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Holders"
          value={data.currentHolderCount.toLocaleString()}
          accent="var(--ww-teal)"
          sub={`from ${data.mintHolderCount} at mint`}
        />
        <Stat
          label="Diamond hands"
          value={data.diamondHandsCount.toLocaleString()}
          accent="var(--ww-yellow)"
          sub={`wallets · still hold ${data.stillHeldFromMintCount} (${stillPct}%) of original mint`}
        />
        <Stat
          label="Last 7d transfers"
          value={data.recentActivity.last7Transfers.toLocaleString()}
          accent="var(--ww-pink)"
          sub={`${data.recentActivity.last30Transfers} in last 30d`}
        />
        <Stat
          label="Burned"
          value={data.burned.toString()}
          accent="var(--ww-purple)"
          sub={`of ${data.totalSupply}`}
        />
      </div>

      {/* Distribution */}
      <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
        <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
          · Holder distribution
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          How concentrated the supply is across the {data.currentHolderCount}{" "}
          wallets that currently hold whales.
        </div>
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
          {dist.map(
            (d) =>
              d.value > 0 && (
                <div
                  key={d.label}
                  className="h-full"
                  style={{
                    width: `${(d.value / totalDist) * 100}%`,
                    background: d.color,
                  }}
                  title={`${d.label}: ${d.value} wallets`}
                />
              ),
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {dist.map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: d.color }}
              />
              <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                {d.label}
              </span>
              <span className="font-pixel text-[11px] tabular-nums text-foreground">
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top holders */}
      <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
        <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
          · Top holders right now
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          The 10 wallets with the most whales today.
        </div>
        <ul className="divide-y divide-white/5">
          {topHolders.map((h, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const pct = (h.count / max) * 100;
            const ofSupplyPct = ((h.count / data.totalSupply) * 100).toFixed(1);
            return (
              <li key={h.address} className="py-2.5">
                <div className="flex items-center gap-3">
                  <span
                    className="shrink-0 grid h-6 w-6 place-items-center rounded font-pixel text-[10px] tabular-nums text-black"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </span>
                  <Link
                    href={`/wallet/${h.address}`}
                    className="group inline-flex items-center gap-1 font-mono text-[12px] text-foreground hover:text-[var(--ww-pink)] transition-colors"
                    title={h.address}
                  >
                    {shortAddr(h.address)}
                    <ArrowRight className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                  </Link>
                  <div className="flex-1 mx-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: accent }}
                    />
                  </div>
                  <span className="shrink-0 font-pixel text-[11px] tabular-nums text-foreground">
                    {h.count}
                  </span>
                  <span className="hidden sm:inline-block shrink-0 font-pixel text-[10px] tabular-nums text-muted-foreground w-12 text-right">
                    {ofSupplyPct}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string;
  accent: string;
  sub?: string;
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
      {sub && (
        <div className="mt-1 text-[11px] text-muted-foreground leading-snug">
          {sub}
        </div>
      )}
    </div>
  );
}
