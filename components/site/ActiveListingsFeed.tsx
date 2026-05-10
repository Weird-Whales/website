import Link from "next/link";
import type { ActiveListing } from "@/lib/opensea";
import { whaleImageUrl } from "./WhaleImage";
import { Money } from "./Money";

function shortAddr(addr: string | null) {
  if (!addr) return "-";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ActiveListingsFeed({
  listings,
}: {
  listings: ActiveListing[];
}) {
  if (!listings.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 p-10 text-center">
        <p className="font-pixel text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
          · No active listings right now
        </p>
      </div>
    );
  }

  const top = listings.slice(0, 12);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
            · Cheapest live listings
          </div>
          <div className="text-sm text-muted-foreground">
            Top {top.length} of {listings.length} active listings on OpenSea -
            sorted floor first.
          </div>
        </div>
        <a
          href="https://opensea.io/collection/weirdwhales"
          target="_blank"
          rel="noreferrer noopener"
          className="font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-pink)] hover:text-[var(--ww-magenta)]"
        >
          See all →
        </a>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((l) => (
          <li key={`${l.tokenId}-${l.startTime}`}>
            <Link
              href={`/whale/${l.tokenId}`}
              className="group flex gap-3 rounded-xl border border-white/10 bg-black/30 p-3 hover:border-[var(--ww-teal)]/40 transition-all"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={whaleImageUrl(l.tokenId)}
                  alt={`Whale #${l.tokenId}`}
                  className="h-full w-full object-cover pixelated"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-teal)]">
                    #{l.tokenId}
                  </span>
                  <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                    LIVE
                  </span>
                </div>
                <div className="mt-1 font-pixel text-base text-foreground">
                  <Money eth={l.priceEth} />
                </div>
                <div className="mt-1 text-[11px] font-mono text-muted-foreground truncate">
                  by {shortAddr(l.seller)}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
