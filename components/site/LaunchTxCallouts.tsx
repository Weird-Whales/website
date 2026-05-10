import { ExternalLink, Flag, Crown, AlertTriangle } from "lucide-react";
import type { LaunchTx } from "./MintHeatmap";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function shortTx(hash: string) {
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`;
}

function relTime(iso: string, base: string) {
  const diff = new Date(iso).getTime() - new Date(base).getTime();
  const sec = Math.abs(Math.round(diff / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

const CARD = ({
  Icon,
  accent,
  label,
  tx,
  caption,
}: {
  Icon: typeof Flag;
  accent: string;
  label: string;
  tx: LaunchTx;
  caption: string;
}) => (
  <a
    href={`https://etherscan.io/tx/${tx.hash}`}
    target="_blank"
    rel="noreferrer noopener"
    className="group relative block overflow-hidden rounded-xl border border-white/10 bg-card/50 p-4 transition-all hover:-translate-y-0.5 backdrop-blur-sm"
    style={{ ["--c" as string]: accent }}
  >
    <div
      className="absolute top-0 left-0 right-0 h-0.5"
      style={{ background: accent }}
    />
    <div className="flex items-center gap-2 mb-2.5">
      <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
      <span
        className="font-pixel text-[10px] tracking-[0.18em] uppercase"
        style={{ color: accent }}
      >
        {label}
      </span>
    </div>
    <div className="font-mono text-[12px] text-foreground break-all">
      {shortTx(tx.hash)}
    </div>
    <div className="mt-1 text-xs text-muted-foreground">
      from <span className="font-mono">{shortAddr(tx.from)}</span>
    </div>
    <div className="mt-3 flex items-end justify-between gap-2">
      <div className="text-[11px] text-muted-foreground">{caption}</div>
      <ExternalLink className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-foreground" />
    </div>
  </a>
);

export function LaunchTxCallouts({
  firstMint,
  lastMint,
  firstRevert,
}: {
  firstMint: LaunchTx | null | undefined;
  lastMint: LaunchTx | null | undefined;
  firstRevert: LaunchTx | null | undefined;
}) {
  if (!firstMint || !lastMint) return null;
  const totalWindow = relTime(lastMint.timestamp, firstMint.timestamp);
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <CARD
        Icon={Flag}
        accent="var(--ww-teal)"
        label="First mint"
        tx={firstMint}
        caption={new Date(firstMint.timestamp).toUTCString().slice(5, 22)}
      />
      {firstRevert && (
        <CARD
          Icon={AlertTriangle}
          accent="var(--ww-orange)"
          label="First revert"
          tx={firstRevert}
          caption={`gas war begins · ${relTime(firstRevert.timestamp, firstMint.timestamp)} after launch`}
        />
      )}
      <CARD
        Icon={Crown}
        accent="var(--ww-pink)"
        label="Sell-out"
        tx={lastMint}
        caption={`final mint · ${totalWindow} after launch`}
      />
    </div>
  );
}
