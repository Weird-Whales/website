"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, RotateCcw, FastForward, ExternalLink } from "lucide-react";
import { whaleImageUrl } from "./WhaleImage";
import { Money } from "./Money";

type Mint = {
  tokenId: number;
  ts: number;
  txHash: string;
  minter: string;
  valueEth: number;
};

// Sampled directly from the actual NFT body pixels, not the brand palette.
// See scripts/sample-base-colors.mjs.
const BASE_COLOR: Record<string, string> = {
  Alien: "#C8FBFB",
  Ape: "#856F56",
  Zombie: "#7DA269",
  Normal: "#4051B5",
};

const SPEEDS = [
  { label: "60×", value: 60 },
  { label: "300×", value: 300 },
  { label: "1500×", value: 1500 },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function fmtTimestamp(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} · ${hh}:${mm}:${ss} UTC`;
}

function fmtElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function MintReplay({
  mints,
  baseByTokenId,
}: {
  mints: Mint[];
  baseByTokenId: Record<number, string>;
}) {
  const startTime = mints[0]?.ts ?? 0;
  const endTime = mints[mints.length - 1]?.ts ?? 0;
  const totalDuration = Math.max(1, endTime - startTime);
  const TOTAL = mints.length;

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [virtualMs, setVirtualMs] = useState(0); // ms elapsed since startTime
  const lastFrameRef = useRef<number>(0);

  // Animate virtual time forward
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    lastFrameRef.current = performance.now();
    const tick = () => {
      const now = performance.now();
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;
      setVirtualMs((v) => {
        const next = v + delta * speed;
        if (next >= totalDuration) {
          setPlaying(false);
          return totalDuration;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, totalDuration]);

  const virtualTime = startTime + virtualMs;

  // Binary search for first index where ts > virtualTime
  const cutoff = useMemo(() => {
    let lo = 0;
    let hi = mints.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (mints[mid].ts <= virtualTime) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }, [virtualTime, mints]);

  const minted = cutoff;
  const latest = cutoff > 0 ? mints[cutoff - 1] : null;

  // Current 1-minute rate (for stats)
  const recentRate = useMemo(() => {
    if (!latest) return 0;
    const window = 60_000;
    const start = virtualTime - window;
    let count = 0;
    for (let i = cutoff - 1; i >= 0; i--) {
      if (mints[i].ts < start) break;
      count++;
    }
    return count;
  }, [cutoff, virtualTime, mints, latest]);

  // Cumulative ETH earned up to virtualTime. We precompute prefix sums once
  // so seeking is O(1) instead of O(n) per frame.
  const cumulativeEth = useMemo(() => {
    const sums = new Float64Array(mints.length + 1);
    let acc = 0;
    for (let i = 0; i < mints.length; i++) {
      acc += mints[i].valueEth ?? 0;
      sums[i + 1] = acc;
    }
    return sums;
  }, [mints]);
  const earnedEth = cumulativeEth[cutoff];

  const togglePlay = useCallback(() => {
    if (virtualMs >= totalDuration) {
      setVirtualMs(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [virtualMs, totalDuration]);

  const restart = useCallback(() => {
    setVirtualMs(0);
    setPlaying(false);
  }, []);

  const skipToEnd = useCallback(() => {
    setVirtualMs(totalDuration);
    setPlaying(false);
  }, [totalDuration]);

  const onScrub = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVirtualMs(Number(e.target.value));
      setPlaying(false);
    },
    [],
  );

  // Layout: 67 rows × 50 cols = 3350 cells (sorted by tokenId)
  const COLS = 50;
  const ROWS = Math.ceil(TOTAL / COLS);

  // Map tokenId → mint timestamp for the grid lookup
  const mintTsByTokenId = useMemo(() => {
    const map = new Map<number, number>();
    for (const m of mints) map.set(m.tokenId, m.ts);
    return map;
  }, [mints]);

  return (
    <div className="space-y-6">
      {/* Header / live readout */}
      <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-teal)] mb-1">
              · Replay
            </div>
            <div className="text-sm text-muted-foreground">
              Press play, watch all 3,350 whales appear in the order they
              were minted.
            </div>
          </div>
          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground tabular-nums">
            {fmtTimestamp(virtualTime)}
          </div>
        </div>

        {/* Progress bar / scrubber */}
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={totalDuration}
            value={virtualMs}
            onChange={onScrub}
            className="w-full accent-[var(--ww-pink)] cursor-pointer"
          />
          <div className="flex items-baseline justify-between gap-3 font-pixel text-[10px] tracking-[0.18em] uppercase">
            <span className="text-muted-foreground tabular-nums">
              T+ {fmtElapsed(virtualMs)}
            </span>
            <span className="tabular-nums text-foreground">
              {minted.toLocaleString()} / {TOTAL.toLocaleString()} minted
            </span>
            <span className="text-muted-foreground tabular-nums">
              of {fmtElapsed(totalDuration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={togglePlay}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--ww-pink)] px-4 py-2 font-pixel text-[10px] tracking-[0.18em] uppercase text-black hover:bg-[var(--ww-magenta)] transition-colors"
          >
            {playing ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : virtualMs >= totalDuration ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Replay
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Play
              </>
            )}
          </button>
          <div className="inline-flex rounded-md border border-white/10 bg-white/5 p-0.5">
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSpeed(s.value)}
                className={`font-pixel text-[10px] tracking-[0.18em] uppercase rounded px-2.5 py-1 transition-colors ${
                  speed === s.value
                    ? "bg-[var(--ww-teal)] text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={restart}
            className="inline-flex items-center gap-1.5 font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Restart"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restart
          </button>
          <button
            onClick={skipToEnd}
            className="inline-flex items-center gap-1.5 font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <FastForward className="h-3.5 w-3.5" /> Skip to end
          </button>
        </div>
      </div>

      {/* Two-column: latest whale + grid */}
      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            · Now minting
          </div>
          {latest ? (
            <div className="space-y-3">
              <Link
                href={`/whale/${latest.tokenId}`}
                className="group relative block aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40"
              >
                <Image
                  src={whaleImageUrl(latest.tokenId)}
                  alt={`Whale #${latest.tokenId}`}
                  width={400}
                  height={400}
                  unoptimized
                  className="pixelated h-full w-full"
                />
                <div className="absolute top-2 left-2 rounded bg-black/70 backdrop-blur-sm px-2 py-1 font-pixel text-[10px] tracking-[0.18em] uppercase">
                  #{latest.tokenId}
                </div>
                <div className="absolute bottom-2 right-2 rounded bg-[var(--ww-teal)] px-2 py-1 font-pixel text-[10px] tracking-[0.18em] uppercase text-black">
                  Mint #{minted.toLocaleString()}
                </div>
              </Link>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                    Time
                  </span>
                  <span className="font-mono tabular-nums text-foreground">
                    {fmtTimestamp(latest.ts)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                    Minter
                  </span>
                  <a
                    href={`https://opensea.io/${latest.minter}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-foreground hover:text-[var(--ww-pink)] inline-flex items-center gap-1"
                  >
                    {shortAddr(latest.minter)}
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                    Tx
                  </span>
                  <a
                    href={`https://etherscan.io/tx/${latest.txHash}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-foreground hover:text-[var(--ww-pink)] inline-flex items-center gap-1"
                  >
                    {latest.txHash.slice(0, 10)}…
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </div>
                <div className="flex items-baseline justify-between gap-2 pt-1 mt-2 border-t border-white/5">
                  <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                    Earned so far
                  </span>
                  <Money
                    eth={earnedEth}
                    className="font-pixel text-[var(--ww-yellow)] tabular-nums"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                    Pace · last 60s
                  </span>
                  <span className="font-pixel text-foreground tabular-nums">
                    {recentRate} mints
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-square rounded-xl border border-dashed border-white/10 bg-black/30 grid place-items-center">
              <p className="text-xs text-muted-foreground text-center px-4">
                Press play to start the timeline.
              </p>
            </div>
          )}
        </div>

        {/* Grid of all whales */}
        <div className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-sm">
          <div className="flex items-baseline justify-between mb-3">
            <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              · All 3,350 whales
            </div>
            <div className="flex items-center gap-3 text-[10px] font-pixel tracking-[0.18em] uppercase text-muted-foreground">
              {Object.entries(BASE_COLOR).map(([base, color]) => (
                <span key={base} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-[2px]"
                    style={{ background: color }}
                  />
                  {base}
                </span>
              ))}
            </div>
          </div>
          <div
            className="grid gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              if (i >= TOTAL) return <div key={i} />;
              const tokenId = i;
              const ts = mintTsByTokenId.get(tokenId);
              const isMinted = ts != null && ts <= virtualTime;
              const isLatest = latest?.tokenId === tokenId;
              const base = baseByTokenId[tokenId];
              const color = base ? BASE_COLOR[base] : "var(--ww-pink)";
              return (
                <Link
                  key={i}
                  href={`/whale/${tokenId}`}
                  className="aspect-square rounded-[2px] transition-all"
                  style={{
                    background: isMinted ? color : "rgba(255,255,255,0.04)",
                    boxShadow: isLatest ? "0 0 0 1px white" : undefined,
                    opacity: isMinted ? 1 : 1,
                  }}
                  title={`#${tokenId}${ts ? ` · ${fmtTimestamp(ts)}` : ""}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
