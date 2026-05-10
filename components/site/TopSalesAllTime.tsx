import Link from "next/link";
import { whaleImageUrl } from "./WhaleImage";
import { Money } from "./Money";

export type TopSale = {
  tokenId: number;
  priceEth: number;
  symbol: string;
  ts: number;
  seller: string | null;
  buyer: string | null;
};

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function shortAddr(addr: string | null) {
  if (!addr) return "-";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

const ACCENTS = [
  "var(--ww-yellow)",
  "var(--ww-pink)",
  "var(--ww-teal)",
  "var(--ww-purple)",
  "var(--ww-orange)",
];

export function TopSalesAllTime({ sales }: { sales: TopSale[] }) {
  if (!sales.length) return null;
  const top = sales.slice(0, 12);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
            · Top sales all-time
          </div>
          <div className="text-sm text-muted-foreground">
            The biggest secondary sales since launch.
          </div>
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((s, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <li key={`${s.tokenId}-${s.ts}-${i}`}>
              <Link
                href={`/whale/${s.tokenId}`}
                className="group flex gap-3 rounded-xl border border-white/10 bg-black/30 p-3 hover:border-white/30 transition-all"
              >
                <div
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg pixel-shadow"
                  style={{ borderColor: accent }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={whaleImageUrl(s.tokenId)}
                    alt={`Whale #${s.tokenId}`}
                    className="h-full w-full object-cover pixelated"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className="font-pixel text-[10px] tracking-[0.18em] uppercase"
                      style={{ color: accent }}
                    >
                      #{i + 1} · #{s.tokenId}
                    </span>
                    <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                      {fmtDate(s.ts)}
                    </span>
                  </div>
                  <div className="mt-1 font-pixel text-base text-foreground">
                    <Money eth={s.priceEth} />
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-muted-foreground truncate">
                    {shortAddr(s.seller)} → {shortAddr(s.buyer)}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
