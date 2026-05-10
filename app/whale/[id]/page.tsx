import { notFound } from "next/navigation";
import Link from "next/link";
import { ViewTransition } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Tag,
  Wallet,
  Gavel,
  Crown,
} from "lucide-react";
import type { Metadata } from "next";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";
import { WhaleImage } from "@/components/site/WhaleImage";
import { Reveal } from "@/components/site/Reveal";
import allTraits from "@/utils/all-traits.json";
import { traitFrequency } from "@/utils/trait-frequency";
import { routes } from "@/utils/routes";
import { computeRandomWhaleID } from "@/utils/compute-random-whale-id";
import { getRarityRank, getRarityScore } from "@/utils/rarity";
import {
  getWhaleLiveInfo,
  shortAddress,
  formatRelativeTime,
} from "@/lib/opensea";
import { Money } from "@/components/site/Money";
import { WallpaperButton } from "@/components/site/WallpaperButton";

const TOTAL_SUPPLY = 3350;

type Props = { params: Promise<{ id: string }> };

type WhaleTraits = {
  Background: string;
  Base: string;
  "Eye Accessory": string;
  Headgear: string;
  "Mouth Accessory": string;
  tokenId: number;
};

function getWhale(id: number): WhaleTraits | null {
  if (!Number.isInteger(id) || id < 0 || id >= TOTAL_SUPPLY) return null;
  return (allTraits as WhaleTraits[])[id] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const n = Number(id);
  const whale = getWhale(n);
  if (!whale) return { title: "Whale not found" };
  const baseCount =
    traitFrequency.Base[whale.Base as keyof typeof traitFrequency.Base];
  const description = `Whale #${n} - one of ${baseCount.toLocaleString()} ${whale.Base} whales. ${whale.Headgear}, ${whale["Eye Accessory"]}, ${whale["Mouth Accessory"]}.`;
  // OG/Twitter images come from the colocated opengraph-image.tsx file.
  return {
    title: `Whale #${n}`,
    description,
    openGraph: { title: `Weird Whale #${n}`, description },
    twitter: {
      card: "summary_large_image",
      title: `Weird Whale #${n}`,
      description,
    },
  };
}

const TRAIT_ACCENTS: Record<string, string> = {
  Background: "var(--ww-sky)",
  Base: "var(--ww-pink)",
  "Eye Accessory": "var(--ww-magenta)",
  Headgear: "var(--ww-orange)",
  "Mouth Accessory": "var(--ww-coral)",
};

const FREQ_KEY: Record<string, keyof typeof traitFrequency> = {
  Background: "Background",
  Base: "Base",
  "Eye Accessory": "Eye",
  Headgear: "Headgear",
  "Mouth Accessory": "Mouth",
};

export default async function WhalePage({ params }: Props) {
  const { id } = await params;
  const n = Number(id);
  const whale = getWhale(n);
  if (!whale) notFound();

  const traitOrder: (keyof WhaleTraits)[] = [
    "Base",
    "Background",
    "Eye Accessory",
    "Headgear",
    "Mouth Accessory",
  ];

  const baseCount =
    traitFrequency.Base[whale.Base as keyof typeof traitFrequency.Base];
  const basePct = ((baseCount / TOTAL_SUPPLY) * 100).toFixed(1);

  const prevId = (n - 1 + TOTAL_SUPPLY) % TOTAL_SUPPLY;
  const nextId = (n + 1) % TOTAL_SUPPLY;
  const randomId = computeRandomWhaleID();

  const localRank = getRarityRank(n);
  const score = getRarityScore(n);

  // Live data from OpenSea (cached server-side, won't block static fallback)
  const live = await getWhaleLiveInfo(n);

  // Local OpenRarity computation matches OpenSea's rank exactly. Still prefer
  // the live value when available - it's the authoritative source if OpenSea
  // ever recomputes - but the local fallback is correct rather than approximate.
  const rank = live?.rarityRank ?? localRank;
  const rankPct = ((rank / TOTAL_SUPPLY) * 100).toFixed(1);

  return (
    <>
      <TopNav />

      <main className="flex-1">
        <ViewTransition
          enter={{
            "nav-forward": "nav-forward",
            "nav-back": "nav-back",
            default: "none",
          }}
          exit={{
            "nav-forward": "nav-forward",
            "nav-back": "nav-back",
            default: "none",
          }}
          default="none"
        >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
            {/* IMAGE */}
            <Reveal>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--ww-pink)]/30 via-[var(--ww-purple)]/20 to-[var(--ww-teal)]/20 blur-2xl" />
                  <WhaleImage
                    whaleID={n}
                    size={520}
                    priority
                    className="relative w-full max-w-[520px] aspect-square h-auto"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Link
                    href={`${routes.internal.whale}${prevId}`}
                    transitionTypes={["nav-back"]}
                    className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-pixel tracking-[0.16em] uppercase hover:bg-white/10"
                  >
                    ← #{prevId}
                  </Link>
                  <Link
                    href={`${routes.internal.whale}${randomId}`}
                    transitionTypes={["nav-forward"]}
                    className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-pixel tracking-[0.16em] uppercase hover:bg-white/10"
                  >
                    Random
                  </Link>
                  <Link
                    href={`${routes.internal.whale}${nextId}`}
                    transitionTypes={["nav-forward"]}
                    className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-pixel tracking-[0.16em] uppercase hover:bg-white/10"
                  >
                    #{nextId} →
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* DETAILS */}
            <div className="space-y-8">
              <Reveal delay={0.05}>
                <div>
                  <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-pink)] mb-3">
                    Token #{n}
                  </div>
                  <h1 className="font-pixel text-3xl md:text-5xl tracking-[0.04em]">
                    WEIRD&nbsp;
                    <span className="text-gradient-ww">WHALE</span>
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ww-yellow)]/30 bg-[var(--ww-yellow)]/10 px-3 py-1 text-xs"
                      title="OpenRarity rank - matches OpenSea's official ranking"
                    >
                      <Crown className="h-3.5 w-3.5 text-[var(--ww-yellow)]" />
                      <span className="font-pixel text-[10px] tracking-[0.16em] uppercase text-[var(--ww-yellow)]">
                        Rank
                      </span>
                      <span className="font-pixel text-[11px] tabular-nums text-foreground">
                        {rank.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        / {TOTAL_SUPPLY.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        · top {rankPct}%
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                      <span className="font-pixel text-[10px] tracking-[0.16em] uppercase">
                        OpenRarity
                      </span>
                      <span className="font-mono text-foreground">
                        {score.toFixed(1)}
                      </span>
                      <span className="text-[10px]">bits</span>
                    </span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    One of{" "}
                    <span className="text-foreground font-medium">
                      {baseCount.toLocaleString()}
                    </span>{" "}
                    <span className="text-foreground font-medium">
                      {whale.Base}
                    </span>{" "}
                    whales · {basePct}% of the collection.
                  </p>
                </div>
              </Reveal>

              {live && (live.bestListing || live.lastSale || live.owner) && (
                <Reveal delay={0.08}>
                  <div className="rounded-xl border border-white/10 bg-card/50 p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ww-teal)] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ww-teal)]" />
                      </span>
                      <span className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                        Live · OpenSea
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {live.bestListing ? (
                        <LiveStat
                          icon={<Tag className="h-3.5 w-3.5" />}
                          label="Listed for"
                          accent="var(--ww-pink)"
                          primary={<Money eth={live.bestListing.priceEth} />}
                          secondary={live.bestListing.marketplace}
                        />
                      ) : (
                        <LiveStat
                          icon={<Tag className="h-3.5 w-3.5" />}
                          label="Listing"
                          accent="var(--ww-pink)"
                          primary="-"
                          secondary="not listed"
                        />
                      )}
                      {live.lastSale ? (
                        <LiveStat
                          icon={<Gavel className="h-3.5 w-3.5" />}
                          label="Last sale"
                          accent="var(--ww-yellow)"
                          primary={<Money eth={live.lastSale.priceEth} />}
                          secondary={formatRelativeTime(live.lastSale.timestamp)}
                        />
                      ) : (
                        <LiveStat
                          icon={<Gavel className="h-3.5 w-3.5" />}
                          label="Last sale"
                          accent="var(--ww-yellow)"
                          primary="-"
                          secondary="no sales yet"
                        />
                      )}
                      {live.owner ? (
                        <LiveStat
                          icon={<Wallet className="h-3.5 w-3.5" />}
                          label="Owner"
                          accent="var(--ww-purple)"
                          primary={
                            <a
                              href={`https://opensea.io/${live.owner}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="font-mono text-base hover:text-[var(--ww-purple)] transition-colors"
                            >
                              {shortAddress(live.owner)}
                            </a>
                          }
                          secondary="view on OpenSea"
                        />
                      ) : (
                        <LiveStat
                          icon={<Wallet className="h-3.5 w-3.5" />}
                          label="Owner"
                          accent="var(--ww-purple)"
                          primary="-"
                          secondary="unknown"
                        />
                      )}
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.1}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {traitOrder.map((key) => {
                    const value = whale[key] as string;
                    const freqKey = FREQ_KEY[key];
                    const freqMap = traitFrequency[freqKey] as Record<
                      string,
                      number
                    >;
                    const count = freqMap[value] ?? 0;
                    const pct = count
                      ? ((count / TOTAL_SUPPLY) * 100).toFixed(1)
                      : "-";
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="font-pixel text-[10px] tracking-[0.18em] uppercase"
                            style={{ color: TRAIT_ACCENTS[key] }}
                          >
                            {key.replace(" Accessory", "")}
                          </span>
                          <span className="font-pixel text-[10px] text-muted-foreground tabular-nums">
                            {count} · {pct}%
                          </span>
                        </div>
                        <div className="mt-2 text-lg text-foreground">
                          {value === "None" ? (
                            <span className="text-muted-foreground italic">
                              None
                            </span>
                          ) : (
                            value
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`${routes.external.openSeaWhaleBasePath}${n}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-md bg-[var(--ww-pink)] px-5 py-3 font-pixel text-[11px] tracking-[0.18em] uppercase text-white transition-transform hover:-translate-y-0.5"
                  >
                    OpenSea
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href={routes.external.Etherscan}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 font-pixel text-[11px] tracking-[0.18em] uppercase transition-colors hover:bg-white/10"
                  >
                    Contract
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <WallpaperButton whaleId={n} background={whale.Background} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
        </ViewTransition>
      </main>

      <Footer />
    </>
  );
}

function LiveStat({
  icon,
  label,
  accent,
  primary,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  primary: React.ReactNode;
  secondary: string;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 font-pixel text-[10px] tracking-[0.18em] uppercase mb-1.5"
        style={{ color: accent }}
      >
        {icon}
        {label}
      </div>
      <div className="text-base font-semibold text-foreground">{primary}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">
        {secondary}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  // Pre-render the first batch; rest will be statically generated on demand.
  return Array.from({ length: 50 }, (_, i) => ({ id: String(i) }));
}
