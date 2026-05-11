import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { ProvenanceTable } from "./ProvenanceTable";
import { PROVENANCE_HASH_FINAL, PROVENANCE_HASH } from "@/utils/provenance";
import { routes } from "@/utils/routes";
import imageHashes from "@/image-hashes.json";

const CONTRACT_ADDRESS = "0x96Ed81c7F4406Eff359E27BfF6325DC3c9e042BD";

export const metadata: Metadata = {
  title: "Provenance",
  description:
    "Cryptographic provenance record for the Weird Whales NFT collection - contract details, final proof hash, and per-token SHA-256 image hashes.",
};

export default function ProvenancePage() {
  const rows = (imageHashes as { tokenId: number; hash: string }[])
    .slice()
    .sort((a, b) => a.tokenId - b.tokenId);

  return (
    <>
      <TopNav />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-teal)] mb-4">
                · Verifiable
              </div>
              <h1 className="font-pixel text-3xl md:text-5xl tracking-[0.04em] leading-[1.1]">
                <span className="block">PROVENANCE</span>
                <span className="block text-gradient-ww">RECORD</span>
              </h1>
              <p className="mt-5 text-muted-foreground">
                Each whale image was hashed before mint. Concatenating those
                hashes in token order, then hashing the result, produces the
                final proof hash. Anyone can verify nothing was reshuffled
                post-launch.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="grid gap-4 md:grid-cols-2 mb-10">
              <InfoCard
                label="Contract"
                accent="var(--ww-pink)"
                value={
                  <a
                    href={routes.external.Etherscan}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 font-mono text-[12px] break-all hover:text-[var(--ww-pink)] transition-colors"
                  >
                    {CONTRACT_ADDRESS}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                }
              />
              <InfoCard
                label="Final Proof Hash"
                accent="var(--ww-purple)"
                value={
                  <span className="font-mono text-[12px] break-all">
                    {PROVENANCE_HASH_FINAL}
                  </span>
                }
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <details className="group rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm mb-10">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 list-none">
                <span className="font-pixel text-[11px] tracking-[0.18em] uppercase">
                  Concatenated Hash String
                </span>
                <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground group-open:hidden">
                  Show
                </span>
                <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground hidden group-open:inline">
                  Hide
                </span>
              </summary>
              <div className="border-t border-white/5 p-4">
                <textarea
                  readOnly
                  value={PROVENANCE_HASH}
                  rows={10}
                  className="w-full rounded-md bg-black/40 border border-white/5 p-3 font-mono text-[10px] text-muted-foreground resize-y"
                />
              </div>
            </details>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
              <h2 className="font-pixel text-xl md:text-2xl tracking-[0.04em]">
                WHALE&nbsp;<span className="text-[var(--ww-yellow)]">RECORD</span>
              </h2>
              <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                {rows.length.toLocaleString()} entries
              </span>
            </div>
            <ProvenanceTable rows={rows} />
          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  );
}

function InfoCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/50 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          {label}
        </div>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: accent }}
        />
      </div>
      <div className="text-foreground">{value}</div>
    </div>
  );
}
