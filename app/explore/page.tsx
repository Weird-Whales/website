import type { Metadata } from "next";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import allTraits from "@/utils/all-traits.json";
import { traitFrequency } from "@/utils/trait-frequency";
import { getRarityRank, getRarityScore } from "@/utils/rarity";
import { Explorer, type ExplorerWhale } from "./Explorer";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Browse all 3,350 Weird Whales. Filter by trait, sort by rarity, search by token ID.",
};

type RawWhale = {
  Background: string;
  Base: string;
  "Eye Accessory": string;
  Headgear: string;
  "Mouth Accessory": string;
  tokenId: number;
};

export default function ExplorePage() {
  const whales: ExplorerWhale[] = (allTraits as RawWhale[]).map((w) => ({
    id: w.tokenId,
    base: w.Base,
    background: w.Background,
    eye: w["Eye Accessory"],
    headgear: w.Headgear,
    mouth: w["Mouth Accessory"],
    rank: getRarityRank(w.tokenId),
    score: getRarityScore(w.tokenId),
  }));

  const filterGroups = {
    Base: Object.keys(traitFrequency.Base).sort(),
    Background: Object.keys(traitFrequency.Background).sort(),
    Eye: Object.keys(traitFrequency.Eye).sort(),
    Headgear: Object.keys(traitFrequency.Headgear).sort(),
    Mouth: Object.keys(traitFrequency.Mouth).sort(),
  };

  return (
    <>
      <TopNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-yellow)] mb-3">
                · The Pod
              </div>
              <h1 className="font-pixel text-3xl md:text-5xl tracking-[0.04em]">
                EXPLORE&nbsp;
                <span className="text-gradient-ww">3,350</span>
              </h1>
              <p className="mt-4 text-muted-foreground">
                Filter by traits, sort by rarity, find that one Weird Whale.
              </p>
            </div>
          </Reveal>
          <Explorer whales={whales} filterGroups={filterGroups} />
        </div>
      </main>
      <Footer />
    </>
  );
}
