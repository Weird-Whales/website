import { ExternalLink } from "lucide-react";
import type { TopMinter } from "./MintHeatmap";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

const TOTAL = 3350;

const ACCENTS = [
  "var(--ww-pink)",
  "var(--ww-yellow)",
  "var(--ww-teal)",
  "var(--ww-purple)",
  "var(--ww-orange)",
];

export function TopMinters({ minters }: { minters: TopMinter[] }) {
  if (!minters?.length) return null;
  const max = minters[0]?.whaleCount ?? 1;

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
            · Top minters
          </div>
          <div className="text-sm text-muted-foreground">
            Wallets that received the most whales at mint.
          </div>
        </div>
      </div>

      <ul className="divide-y divide-white/5">
        {minters.map((m, i) => {
          const accent = ACCENTS[i] ?? "var(--ww-pink)";
          const pct = (m.whaleCount / max) * 100;
          const ofSupplyPct = ((m.whaleCount / TOTAL) * 100).toFixed(1);
          return (
            <li key={m.address} className="py-2.5">
              <div className="flex items-center gap-3">
                <span
                  className="shrink-0 grid h-6 w-6 place-items-center rounded font-pixel text-[10px] tabular-nums text-black"
                  style={{ background: accent }}
                >
                  {i + 1}
                </span>
                <a
                  href={`https://opensea.io/${m.address}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1 font-mono text-[12px] text-foreground hover:text-[var(--ww-pink)] transition-colors"
                  title={m.address}
                >
                  {shortAddr(m.address)}
                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </a>
                <div className="flex-1 mx-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: accent }}
                  />
                </div>
                <span className="shrink-0 font-pixel text-[11px] tabular-nums text-foreground">
                  {m.whaleCount}
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
  );
}
