import type { Metadata } from "next";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { FloorHistoryChart, type SalesDay } from "@/components/site/FloorHistoryChart";
import { TopSalesAllTime, type TopSale } from "@/components/site/TopSalesAllTime";
import { SalesCalendar } from "@/components/site/SalesCalendar";
import { ActiveListingsFeed } from "@/components/site/ActiveListingsFeed";
import { HolderSnapshot, type HolderData } from "@/components/site/HolderSnapshot";
import { WalletLookupForm } from "@/components/site/WalletLookupForm";
import { Money } from "@/components/site/Money";
import { getActiveListings, getCollectionStats } from "@/lib/opensea";
import { getMergedSalesHistory } from "@/lib/sales-history-merged";
import holdersJson from "@/utils/holders.json";

export const metadata: Metadata = {
  title: "Stats",
  description:
    "Live market data for Weird Whales - price history, top sales, active listings, holder snapshot, and wallet lookup.",
};

export const revalidate = 60;

export default async function StatsPage() {
  const [stats, listings, sales] = await Promise.all([
    getCollectionStats(),
    getActiveListings(50),
    getMergedSalesHistory(),
  ]);

  const days = sales.days as SalesDay[];
  const topSales = sales.topSales as TopSale[];
  const lifetime = sales.lifetime;
  const holders = holdersJson as HolderData;

  return (
    <>
      <TopNav />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 py-20 md:py-28 text-center">
            <Reveal>
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-teal)] mb-5">
                · Live data
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-pixel text-4xl leading-[1.1] tracking-[0.04em] sm:text-5xl md:text-6xl">
                <span className="block text-foreground">THE</span>
                <span className="block text-gradient-ww">NUMBERS</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
                Five years of sales, listings, and holders - pulled fresh from
                OpenSea and Etherscan.
              </p>
            </Reveal>
          </div>
        </section>

        {/* TOP-LINE STATS */}
        <section className="mx-auto max-w-5xl px-4 -mt-6">
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <BigStat
                label="Floor"
                value={
                  stats?.floorPriceEth != null ? (
                    <Money eth={stats.floorPriceEth} compact />
                  ) : (
                    "-"
                  )
                }
                accent="var(--ww-pink)"
                sub="lowest active listing"
              />
              <BigStat
                label="Lifetime volume"
                value={<Money eth={lifetime.volumeEth} compact />}
                accent="var(--ww-yellow)"
                sub={`${lifetime.sales.toLocaleString()} sales`}
              />
              <BigStat
                label="Holders"
                value={(stats?.numOwners ?? holders.currentHolderCount).toLocaleString()}
                accent="var(--ww-teal)"
                sub={`of ${holders.totalSupply} supply`}
              />
              <BigStat
                label="24h volume"
                value={
                  stats?.oneDayVolumeEth != null ? (
                    <Money eth={stats.oneDayVolumeEth} compact />
                  ) : (
                    "-"
                  )
                }
                accent="var(--ww-purple)"
                sub={
                  stats?.oneDaySales != null
                    ? `${stats.oneDaySales} sales`
                    : "no recent sales"
                }
              />
            </div>
          </Reveal>
        </section>

        {/* SECTIONS */}
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-20 space-y-16 md:space-y-20">
          {/* Floor history */}
          <Reveal>
            <FloorHistoryChart days={days} />
          </Reveal>

          {/* Active listings */}
          <Reveal>
            <ActiveListingsFeed listings={listings} />
          </Reveal>

          {/* Top sales all-time */}
          <Reveal>
            <TopSalesAllTime sales={topSales} />
          </Reveal>

          {/* Sales calendar */}
          <Reveal>
            <SalesCalendar days={days} />
          </Reveal>

          {/* Holders */}
          <Reveal>
            <SectionHeader
              kicker="Holders"
              title="Who's holding right now"
              accent="var(--ww-teal)"
            />
          </Reveal>
          <Reveal>
            <HolderSnapshot data={holders} />
          </Reveal>

          {/* Wallet lookup */}
          <Reveal>
            <SectionHeader
              kicker="Your wallet"
              title="Got whales?"
              accent="var(--ww-pink)"
            />
          </Reveal>
          <Reveal>
            <WalletLookupForm />
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function SectionHeader({
  kicker,
  title,
  accent,
}: {
  kicker: string;
  title: string;
  accent: string;
}) {
  return (
    <div>
      <div
        className="font-pixel text-[10px] tracking-[0.2em] uppercase mb-2"
        style={{ color: accent }}
      >
        · {kicker}
      </div>
      <h2 className="font-pixel text-2xl tracking-[0.04em] md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function BigStat({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/60 p-4 backdrop-blur-sm">
      <div
        className="font-pixel text-[10px] tracking-[0.18em] uppercase mb-2"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="font-pixel text-2xl text-foreground">{value}</div>
      {sub && (
        <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
      )}
    </div>
  );
}
