import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";
import { Marquee } from "@/components/site/Marquee";
import { Reveal } from "@/components/site/Reveal";
import { CountUp } from "@/components/site/CountUp";
import { WhaleHeroGrid } from "@/components/site/WhaleHeroGrid";
import { TypeCard } from "@/components/site/TypeCard";
import { RecentSalesTicker } from "@/components/site/RecentSalesTicker";
import { FloorSparkline } from "@/components/site/FloorSparkline";
import { MoneyStatValue, MoneySymbol } from "@/components/site/MoneyStat";
import { traitFrequency } from "@/utils/trait-frequency";
import { routes } from "@/utils/routes";
import { getCollectionStats } from "@/lib/opensea";
import allTraits from "@/utils/all-traits.json";

const TOTAL_SUPPLY = 3350;

const TYPE_HREF = (base: string) => {
  const traits = JSON.stringify([{ traitType: "Base", values: [base] }]);
  return `${routes.external.openSeaWWHome}?traits=${encodeURIComponent(traits)}`;
};

// Body colors sampled from the actual NFT pixels (see scripts/sample-base-colors.mjs).
const TYPES = [
  { name: "Alien", count: traitFrequency.Base.Alien, color: "#C8FBFB" },
  { name: "Ape", count: traitFrequency.Base.Ape, color: "#856F56" },
  { name: "Zombie", count: traitFrequency.Base.Zombie, color: "#7DA269" },
  { name: "Normal", count: traitFrequency.Base.Normal, color: "#4051B5" },
];

type WhaleTraits = { tokenId: number; Base: string };

function pickSampleForBase(base: string, seed: number): number {
  const candidates = (allTraits as WhaleTraits[]).filter(
    (t) => t.Base === base,
  );
  if (!candidates.length) return 0;
  const idx = Math.abs(((seed * 1103515245) ^ 0x9e3779b1) >>> 0) % candidates.length;
  return candidates[idx].tokenId;
}

// Daily seed so the hero whales rotate but stay stable within a day.
function dailySeed() {
  return Math.floor(Date.now() / 86400000);
}

export default async function Home() {
  const seed = dailySeed();
  const sampleIDs = TYPES.map((t, i) => pickSampleForBase(t.name, seed + i * 7));
  const stats = await getCollectionStats();

  return (
    <>
      <TopNav />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-7 text-center lg:text-left">
              <Reveal>
                <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-pink)]">
                  · est. July 2021
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="font-pixel text-4xl leading-[1.15] tracking-[0.04em] sm:text-5xl md:text-6xl">
                  <span className="block text-foreground">WEIRD</span>
                  <span className="block text-gradient-ww">WHALES</span>
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="max-w-xl text-base text-muted-foreground md:text-lg mx-auto lg:mx-0">
                  The iconic collection created by Benyamin Ahmed at 12
                  during the summer holidays. No bank account, no funding,
                  no team - just an Ethereum wallet, coding skills, and a
                  Discord. Sold out in 11 hours. The open-sourced generator
                  picked up{" "}
                  <span className="text-foreground">1,600+ stars</span>{" "}
                  and influenced a wave of pixel collections, including
                  Gremplin&apos;s CrypToadz.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <a
                    href={routes.external.openSeaWWHome}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2 rounded-md bg-[var(--ww-pink)] px-5 py-3 font-pixel text-[11px] tracking-[0.18em] uppercase text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--ww-purple)]"
                  >
                    View on OpenSea
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <Link
                    href="/story"
                    className="group inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 font-pixel text-[11px] tracking-[0.18em] uppercase text-foreground transition-all hover:bg-white/10 hover:-translate-y-0.5"
                  >
                    Relive the Story
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="max-w-md pt-4 border-t border-white/5 mx-auto lg:mx-0">
                  <div className="grid grid-cols-3 gap-4">
                    {stats?.floorPriceEth != null ? (
                      <MoneyStatBlock
                        label="Floor"
                        eth={stats.floorPriceEth}
                        accent="pink"
                      />
                    ) : (
                      <Stat label="Whales" value={TOTAL_SUPPLY} accent="pink" />
                    )}
                    {stats?.numOwners != null ? (
                      <Stat label="Owners" value={stats.numOwners} accent="teal" />
                    ) : (
                      <Stat label="Whale Types" value={4} accent="teal" />
                    )}
                    {stats?.totalVolumeEth != null ? (
                      <MoneyStatBlock
                        label="Volume"
                        eth={stats.totalVolumeEth}
                        accent="yellow"
                      />
                    ) : (
                      <Stat
                        label="Headgears"
                        value={Object.keys(traitFrequency.Headgear).length}
                        accent="yellow"
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <FloorSparkline />
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1} y={24}>
              <WhaleHeroGrid seed={seed} />
            </Reveal>
          </div>
        </section>

        <RecentSalesTicker />

        <Marquee />

        {/* SPOTLIGHT - what's next */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="text-center mb-10">
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-yellow)] mb-3">
                · What&apos;s next
              </div>
              <h2 className="font-pixel text-2xl leading-tight md:text-3xl">
                STILL{" "}
                <span className="text-gradient-ww">BUILDING</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                To date, Benyamin has kept all earnings in Ethereum and
                plans to use it as funding for his next venture - none of
                it has been spent on physical assets.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/story"
              className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
            >
              <Image
                src="/spotlight.png"
                alt="What's next from Benyamin"
                width={1600}
                height={900}
                className="w-full h-auto"
                priority={false}
              />
            </Link>
          </Reveal>
        </section>

        {/* TYPE BREAKDOWN */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="mb-10 text-center md:text-left">
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-pink)] mb-3">
                · 01
              </div>
              <h2 className="font-pixel text-2xl leading-tight md:text-3xl">
                THE FOUR{" "}
                <span className="text-[var(--ww-purple)]">SPECIES</span>
              </h2>
              <p className="mt-3 max-w-lg text-muted-foreground mx-auto md:mx-0">
                Every whale belongs to one of four types - inspired from
                CryptoPunks.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TYPES.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <TypeCard
                  name={t.name}
                  count={t.count}
                  total={TOTAL_SUPPLY}
                  sampleId={sampleIDs[i]}
                  href={TYPE_HREF(t.name)}
                  color={t.color}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* TRAITS PEEK */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="mb-10 text-center md:text-left">
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-teal)] mb-3">
                · 02
              </div>
              <h2 className="font-pixel text-2xl leading-tight md:text-3xl">
                TRAIT&nbsp;
                <span className="text-[var(--ww-yellow)]">RARITY</span>
              </h2>
              <p className="mt-3 max-w-lg text-muted-foreground mx-auto md:mx-0">
                Each whale has 5 trait categories. Some are everywhere whilst
                others are rare.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TraitColumn
              title="Background"
              accent="var(--ww-sky)"
              items={traitFrequency.Background}
              total={TOTAL_SUPPLY}
            />
            <TraitColumn
              title="Eye"
              accent="var(--ww-magenta)"
              items={traitFrequency.Eye}
              total={TOTAL_SUPPLY}
            />
            <TraitColumn
              title="Headgear"
              accent="var(--ww-orange)"
              items={traitFrequency.Headgear}
              total={TOTAL_SUPPLY}
            />
            <TraitColumn
              title="Mouth"
              accent="var(--ww-coral)"
              items={traitFrequency.Mouth}
              total={TOTAL_SUPPLY}
            />
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="px-4 pb-20">
          <Reveal>
            <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(255,61,110,0.12)] via-[rgba(166,107,255,0.08)] to-[rgba(91,206,224,0.10)] p-8 md:p-12 text-center">
              <h3 className="font-pixel text-xl md:text-2xl tracking-[0.04em]">
                JOIN THE&nbsp;
                <span className="text-gradient-ww">POD</span>
              </h3>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                Benyamin and two thousand others are hanging out in the
                Discord. Come say hi.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a
                  href={routes.external.WWDiscord}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-md bg-[var(--ww-purple)] px-5 py-3 font-pixel text-[11px] tracking-[0.18em] uppercase text-white transition-transform hover:-translate-y-0.5"
                >
                  Discord
                </a>
                <a
                  href={routes.external.WWTwitter}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-md border border-white/15 bg-white/5 px-5 py-3 font-pixel text-[11px] tracking-[0.18em] uppercase transition-colors hover:bg-white/10"
                >
                  Twitter
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Stat({
  label,
  value,
  accent,
  decimals = 0,
}: {
  label: string;
  value: number;
  accent: "pink" | "teal" | "yellow";
  decimals?: number;
}) {
  const color =
    accent === "pink"
      ? "text-[var(--ww-pink)]"
      : accent === "teal"
        ? "text-[var(--ww-teal)]"
        : "text-[var(--ww-yellow)]";
  return (
    <div>
      <div className={`font-pixel text-xl sm:text-2xl ${color}`}>
        <CountUp to={value} decimals={decimals} />
      </div>
      <div className="font-pixel text-[9px] tracking-[0.18em] uppercase text-muted-foreground mt-2">
        {label}
      </div>
    </div>
  );
}

function MoneyStatBlock({
  label,
  eth,
  accent,
}: {
  label: string;
  eth: number;
  accent: "pink" | "teal" | "yellow";
}) {
  const color =
    accent === "pink"
      ? "text-[var(--ww-pink)]"
      : accent === "teal"
        ? "text-[var(--ww-teal)]"
        : "text-[var(--ww-yellow)]";
  return (
    <div>
      {/* Compact (e.g. 1.91K) on phone where space is tight; full precision
          on tablet+ where the 3-col grid has room to breathe. */}
      <MoneyStatValue
        eth={eth}
        compact
        className={`font-pixel text-xl sm:hidden ${color}`}
      />
      <MoneyStatValue
        eth={eth}
        className={`hidden font-pixel sm:inline-block sm:text-2xl ${color}`}
      />
      <div className="font-pixel text-[9px] tracking-[0.18em] uppercase text-muted-foreground mt-2">
        {label} (<MoneySymbol />)
      </div>
    </div>
  );
}

function TraitColumn({
  title,
  accent,
  items,
  total,
}: {
  title: string;
  accent: string;
  items: Record<string, number>;
  total: number;
}) {
  const entries = Object.entries(items).sort((a, b) => a[1] - b[1]);
  return (
    <div className="rounded-xl border border-white/10 bg-card/50 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-pixel text-[11px] tracking-[0.2em] uppercase">
          {title}
        </h3>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: accent }}
        />
      </div>
      <ul className="space-y-2">
        {entries.map(([name, count]) => {
          const pct = (count / total) * 100;
          return (
            <li key={name} className="text-xs">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-foreground/90">{name}</span>
                <span className="font-pixel text-[10px] text-muted-foreground tabular-nums">
                  {count}
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    background: accent,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
