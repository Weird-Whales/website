import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Crown } from "lucide-react";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { WhaleImage } from "@/components/site/WhaleImage";
import { WalletLookupForm } from "@/components/site/WalletLookupForm";
import { Money } from "@/components/site/Money";
import {
  getWalletWhales,
  getCollectionStats,
  shortAddress,
} from "@/lib/opensea";
import { getRarityRank } from "@/utils/rarity";
import { routes } from "@/utils/routes";

const TOTAL_SUPPLY = 3350;
const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const ENS_RE = /^[a-zA-Z0-9-]+\.eth$/;

type Props = { params: Promise<{ address: string }> };

async function resolveEns(name: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.ensideas.com/ens/resolve/${encodeURIComponent(name)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const j = (await res.json()) as { address?: string | null };
    return j.address ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  return {
    title: `Whales held by ${address}`,
    description: `What Weird Whales this wallet currently holds.`,
  };
}

export default async function WalletPage({ params }: Props) {
  const { address } = await params;
  const decoded = decodeURIComponent(address);
  const isEns = ENS_RE.test(decoded);
  const isAddr = ADDRESS_RE.test(decoded);

  let resolvedAddr: string | null = null;
  let resolutionError: string | null = null;

  if (isAddr) {
    resolvedAddr = decoded.toLowerCase();
  } else if (isEns) {
    resolvedAddr = await resolveEns(decoded);
    if (!resolvedAddr) resolutionError = `Couldn't resolve ${decoded}.`;
  } else {
    resolutionError = `${decoded} doesn't look like an Ethereum address or .eth name.`;
  }

  const [whales, stats] = await Promise.all([
    resolvedAddr ? getWalletWhales(resolvedAddr) : Promise.resolve([]),
    getCollectionStats(),
  ]);

  const floor = stats?.floorPriceEth ?? null;
  const portfolioFloorValue =
    floor != null ? whales.length * floor : null;

  // Rank summary: best rank, % of collection, top-100 count
  let bestRank: number | null = null;
  let top100Count = 0;
  let top500Count = 0;
  for (const w of whales) {
    const r = getRarityRank(w.tokenId);
    if (bestRank == null || r < bestRank) bestRank = r;
    if (r <= 100) top100Count++;
    if (r <= 500) top500Count++;
  }

  return (
    <>
      <TopNav />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <Reveal>
            <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-pink)] mb-3">
              · Wallet lookup
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-pixel text-3xl md:text-5xl tracking-[0.04em]">
              {isEns ? (
                <>
                  <span className="text-foreground">{decoded}</span>
                </>
              ) : (
                <>
                  <span className="text-foreground">
                    {resolvedAddr ? shortAddress(resolvedAddr) : decoded}
                  </span>
                </>
              )}
            </h1>
          </Reveal>
          {resolvedAddr && (
            <Reveal delay={0.08}>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-mono text-muted-foreground">
                  {resolvedAddr}
                </span>
                <a
                  href={`https://opensea.io/${resolvedAddr}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-pink)] hover:text-[var(--ww-magenta)]"
                >
                  OpenSea profile <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={`https://etherscan.io/address/${resolvedAddr}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground"
                >
                  Etherscan <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Reveal>
          )}

          {resolutionError && (
            <Reveal delay={0.1}>
              <div className="mt-8 rounded-2xl border border-[var(--ww-pink)]/30 bg-[var(--ww-pink)]/5 p-6">
                <p className="text-sm">{resolutionError}</p>
                <div className="mt-4 max-w-md">
                  <WalletLookupForm variant="inline" />
                </div>
              </div>
            </Reveal>
          )}

          {resolvedAddr && (
            <>
              {/* Summary */}
              <section className="mt-10">
                <Reveal delay={0.1}>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <BigStat
                      label="Whales held"
                      value={whales.length.toLocaleString()}
                      sub={`of ${TOTAL_SUPPLY.toLocaleString()}`}
                      accent="var(--ww-pink)"
                    />
                    <BigStat
                      label="Floor value"
                      value={
                        portfolioFloorValue != null ? (
                          <Money eth={portfolioFloorValue} compact />
                        ) : (
                          "-"
                        )
                      }
                      sub={
                        floor != null ? (
                          <>
                            at <Money eth={floor} /> floor
                          </>
                        ) : (
                          "floor unknown"
                        )
                      }
                      accent="var(--ww-yellow)"
                    />
                    <BigStat
                      label="Best rank"
                      value={
                        bestRank != null
                          ? `#${bestRank.toLocaleString()}`
                          : "-"
                      }
                      sub={
                        bestRank != null
                          ? `top ${((bestRank / TOTAL_SUPPLY) * 100).toFixed(1)}%`
                          : "no whales"
                      }
                      accent="var(--ww-teal)"
                    />
                    <BigStat
                      label="Top 100 / 500"
                      value={`${top100Count} / ${top500Count}`}
                      sub="rare whales held"
                      accent="var(--ww-purple)"
                    />
                  </div>
                </Reveal>
              </section>

              {/* Whales grid */}
              <section className="mt-10">
                {whales.length === 0 ? (
                  <Reveal delay={0.15}>
                    <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 p-12 text-center">
                      <p className="font-pixel text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                        · No whales here yet
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                        This wallet doesn&apos;t hold any Weird Whales right
                        now. Check{" "}
                        <a
                          href={routes.external.openSeaWWHome}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[var(--ww-pink)] hover:underline"
                        >
                          the floor
                        </a>{" "}
                        - they&apos;re currently going from{" "}
                        {floor != null ? <Money eth={floor} /> : "-"}.
                      </p>
                    </div>
                  </Reveal>
                ) : (
                  <Reveal delay={0.15}>
                    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
                      <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                        · Held whales
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {whales.map((w) => {
                          const r = getRarityRank(w.tokenId);
                          return (
                            <Link
                              key={w.tokenId}
                              href={`/whale/${w.tokenId}`}
                              className="group block"
                            >
                              <div className="relative">
                                <WhaleImage
                                  whaleID={w.tokenId}
                                  size={400}
                                  responsive
                                  className="w-full aspect-square"
                                  shared={false}
                                />
                                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[10px] font-pixel tracking-[0.16em] uppercase">
                                  <Crown className="h-3 w-3 text-[var(--ww-yellow)]" />
                                  <span className="tabular-nums">{r}</span>
                                </span>
                              </div>
                              <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                                  #{w.tokenId}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </Reveal>
                )}
              </section>
            </>
          )}

          {/* Lookup another */}
          <section className="mt-12">
            <Reveal delay={0.2}>
              <div className="text-center">
                <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  · Look up another wallet
                </div>
                <div className="max-w-md mx-auto">
                  <WalletLookupForm variant="inline" />
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

function BigStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent: string;
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
