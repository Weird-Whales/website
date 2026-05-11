"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { whaleImageUrl, whaleTransitionName } from "./WhaleImage";
import { routes } from "@/utils/routes";

type WhaleSlot = {
  id: number;
  x: number; // percent
  y: number; // percent
  size: number; // px
  delay: number;
  drift: number; // px range for floating
  rotate: number; // initial tilt deg
};

const SLOTS: Omit<WhaleSlot, "id">[] = [
  { x: 8, y: 12, size: 96, delay: 0.0, drift: 10, rotate: -4 },
  { x: 78, y: 8, size: 110, delay: 0.6, drift: 12, rotate: 5 },
  { x: 22, y: 64, size: 130, delay: 0.3, drift: 14, rotate: -3 },
  { x: 70, y: 58, size: 120, delay: 0.9, drift: 11, rotate: 6 },
  { x: 50, y: 28, size: 170, delay: 0.15, drift: 16, rotate: -2 },
  { x: 42, y: 80, size: 80, delay: 1.1, drift: 9, rotate: 8 },
];

function pickWhaleIDs(count: number, seed: number): number[] {
  // Deterministic seeded picker - same SSR/CSR
  const ids = new Set<number>();
  let s = seed || 1;
  while (ids.size < count) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    ids.add(s % 3350);
  }
  return Array.from(ids);
}

type Burst = { id: number; slotIdx: number };

export function WhaleHeroGrid({ seed }: { seed: number }) {
  const reduce = useReducedMotion();
  const [ids] = useState(() => pickWhaleIDs(SLOTS.length, seed));
  const [mounted, setMounted] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstIdRef = useRef(0);
  useEffect(() => {
    // Set after mount so initial paint matches SSR before motion kicks in.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const whales: WhaleSlot[] = SLOTS.map((s, i) => ({ ...s, id: ids[i] }));

  function pet(slotIdx: number) {
    const id = ++burstIdRef.current;
    setBursts((b) => [...b, { id, slotIdx }]);
    window.setTimeout(() => {
      setBursts((b) => b.filter((x) => x.id !== id));
    }, 700);
  }

  return (
    <>
      {/* MOBILE: clean 2x2 grid (the floating layout overflows on phones). */}
      <div className="md:hidden mx-auto w-full max-w-sm">
        <div className="grid grid-cols-2 gap-3">
            {whales.slice(0, 4).map((w, i) => (
              <motion.div
                key={`m-${w.id}-${i}`}
                whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.94, transition: { duration: 0.08 } }}
                className="relative"
              >
                <Link
                  href={`${routes.internal.whale}${w.id}`}
                  onClick={() => pet(i)}
                  className="block"
                  aria-label={`Open Whale #${w.id}`}
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-[0_8px_30px_-8px_rgba(255,61,110,0.4)]">
                    {/* No ViewTransition wrapper here — the desktop grid
                        below already claims whale-${id} names, so wrapping
                        again would mount the same transition name twice. */}
                    <Image
                      src={whaleImageUrl(w.id)}
                      alt={`Whale #${w.id}`}
                      width={300}
                      height={300}
                      unoptimized
                      priority={i < 2}
                      className="pixelated h-full w-full"
                    />
                    <div className="absolute bottom-1 left-1 font-pixel text-[8px] tracking-[0.15em] uppercase text-white/80 bg-black/70 rounded px-1 py-0.5">
                      #{w.id}
                    </div>
                  </div>
                </Link>
                <AnimatePresence>
                  {bursts
                    .filter((b) => b.slotIdx === i)
                    .map((b) => (
                      <SparkleBurst key={`m-${b.id}`} />
                    ))}
                </AnimatePresence>
              </motion.div>
            ))}
        </div>
      </div>

      {/* DESKTOP: the floating grid we know and love. */}
      <div
        className="hidden md:block relative aspect-square w-full max-w-[560px] mx-auto"
        aria-hidden={false}
      >
        {/* faint grid backdrop */}
        <div
          className="absolute inset-0 rounded-3xl opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* glow blobs */}
        <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[var(--ww-pink)] blur-[80px] opacity-30" />
        <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-[var(--ww-purple)] blur-[90px] opacity-30" />
        <div className="absolute bottom-1/3 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[var(--ww-teal)] blur-[80px] opacity-20" />

        {whales.map((w, i) => (
        <motion.div
          key={`${w.id}-${i}`}
          className="absolute"
          style={{
            left: `${w.x}%`,
            top: `${w.y}%`,
            width: w.size,
            height: w.size,
          }}
          initial={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.6, rotate: w.rotate * 2 }
          }
          animate={
            mounted && !reduce
              ? {
                  opacity: 1,
                  scale: 1,
                  rotate: w.rotate,
                  y: [0, -w.drift, 0],
                }
              : { opacity: 1, scale: 1, rotate: w.rotate }
          }
          transition={{
            opacity: { duration: 0.7, delay: w.delay },
            scale: { duration: 0.7, delay: w.delay, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 0.7, delay: w.delay },
            y: {
              duration: 5 + (i % 3),
              delay: w.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          whileHover={{
            scale: 1.12,
            rotate: w.rotate + (i % 2 ? 8 : -8),
            transition: { type: "spring", stiffness: 400, damping: 12 },
          }}
          whileTap={{ scale: 0.92, transition: { duration: 0.08 } }}
        >
          <Link
            href={`${routes.internal.whale}${w.id}`}
            onClick={() => pet(i)}
            className="block h-full w-full"
            aria-label={`Open Whale #${w.id}`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-[0_10px_40px_-10px_rgba(255,61,110,0.5)]">
              <ViewTransition name={whaleTransitionName(w.id)} share="morph">
                <Image
                  src={whaleImageUrl(w.id)}
                  alt={`Whale #${w.id}`}
                  width={w.size}
                  height={w.size}
                  unoptimized
                  priority={i < 3}
                  className="pixelated h-full w-full"
                />
              </ViewTransition>
              <div className="absolute bottom-1 left-1 font-pixel text-[8px] tracking-[0.15em] uppercase text-white/80 bg-black/70 rounded px-1 py-0.5">
                #{w.id}
              </div>
            </div>
          </Link>
          <AnimatePresence>
            {bursts
              .filter((b) => b.slotIdx === i)
              .map((b) => (
                <SparkleBurst key={b.id} />
              ))}
          </AnimatePresence>
        </motion.div>
      ))}
      </div>
    </>
  );
}

const SPARKLE_COLORS = [
  "var(--ww-pink)",
  "var(--ww-yellow)",
  "var(--ww-teal)",
  "var(--ww-purple)",
];

function SparkleBurst() {
  const reduce = useReducedMotion();
  // Generate particle layout once per burst — Math.random in a state
  // initialiser is the canonical way to keep render pure.
  const [particles] = useState(() =>
    Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const distance = 60 + Math.random() * 50;
      return {
        id: i,
        angle,
        distance,
        color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
        size: 4 + Math.random() * 4,
      };
    }),
  );
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: 0,
            scale: 1.2,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}
