import type { Metadata } from "next";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { MintReplay } from "@/components/site/MintReplay";
import allTraits from "@/utils/all-traits.json";
import timelineData from "@/utils/mint-timeline.json";

export const metadata: Metadata = {
  title: "Mint-day Replay",
  description:
    "Press play and watch every Weird Whale appear in the order it was minted on 19 July 2021.",
};

type WhaleTraits = { tokenId: number; Base: string };

type Mint = {
  tokenId: number;
  ts: number;
  txHash: string;
  minter: string;
  valueEth: number;
};

export default function ReplayPage() {
  const mints = (timelineData.mints as Mint[]).slice();
  const baseByTokenId: Record<number, string> = {};
  for (const w of allTraits as WhaleTraits[]) {
    baseByTokenId[w.tokenId] = w.Base;
  }

  return (
    <>
      <TopNav />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20 text-center">
            <Reveal>
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-yellow)] mb-5">
                · 19 July 2021
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-pixel text-4xl leading-[1.1] tracking-[0.04em] sm:text-5xl md:text-6xl">
                <span className="block text-foreground">MINT-DAY</span>
                <span className="block text-gradient-ww">REPLAY</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
                11 hours, 22 minutes, 3,350 whales. Press play to watch every
                mint land in chronological order - the slow trickle, the
                surge, the gas war, the sell-out.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <Reveal>
            <MintReplay mints={mints} baseByTokenId={baseByTokenId} />
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
