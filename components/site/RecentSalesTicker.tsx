import Image from "next/image";
import Link from "next/link";
import { whaleImageUrl } from "./WhaleImage";
import { routes } from "@/utils/routes";
import { getRecentSales, formatRelativeTime } from "@/lib/opensea";
import { Money } from "./Money";

export async function RecentSalesTicker() {
  const sales = await getRecentSales(10);
  if (!sales.length) return null;

  // Duplicate so we can run a seamless infinite scroll
  const loop = [...sales, ...sales];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-black/40">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent" />

      <div className="relative w-full px-4 py-3">
        <div className="relative overflow-hidden">
          <div
            className="flex w-max gap-3 animate-[ww-ticker_60s_linear_infinite] hover:[animation-play-state:paused]"
            style={{ animationName: "ww-ticker" }}
          >
            {loop.map((s, i) => (
              <SaleCard key={i} sale={s} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ww-ticker {
          from { transform: translateX(0%); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function SaleCard({
  sale,
}: {
  sale: import("@/lib/opensea").RecentSale;
}) {
  return (
    <Link
      href={`${routes.internal.whale}${sale.tokenId}`}
      className="flex shrink-0 items-center gap-2.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 hover:bg-white/10 transition-colors"
    >
      <Image
        src={whaleImageUrl(sale.tokenId)}
        alt={`Whale #${sale.tokenId}`}
        width={28}
        height={28}
        unoptimized
        loading="lazy"
        className="pixelated rounded-sm"
      />
      <div className="flex items-center gap-2 text-xs whitespace-nowrap">
        <span className="font-pixel text-[10px] tabular-nums">
          #{sale.tokenId}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="font-pixel text-[11px] text-[var(--ww-yellow)]">
          <Money eth={sale.priceEth} />
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-[10px] text-muted-foreground">
          {formatRelativeTime(sale.timestamp)}
        </span>
      </div>
    </Link>
  );
}
