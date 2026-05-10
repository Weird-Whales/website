"use client";

import { motion } from "motion/react";

const items = [
  "WEIRD WHALES",
  "3,350 NFTS",
  "PIXEL ART",
  "ETHEREUM",
  "GENERATIVE",
  "EST. 2021",
];

export function Marquee() {
  // Duplicate to allow seamless infinite scroll
  const loop = [...items, ...items, ...items];
  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-black/60 py-3">
      <motion.div
        className="flex w-max items-center gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-33.3333%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {loop.map((label, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-pixel text-[12px] tracking-[0.2em] text-foreground"
          >
            <span
              className={
                i % 6 === 0
                  ? "text-[var(--ww-pink)]"
                  : i % 6 === 1
                    ? "text-[var(--ww-orange)]"
                    : i % 6 === 2
                      ? "text-[var(--ww-yellow)]"
                      : i % 6 === 3
                        ? "text-[var(--ww-teal)]"
                        : i % 6 === 4
                          ? "text-[var(--ww-purple)]"
                          : "text-[var(--ww-magenta)]"
              }
            >
              ◆
            </span>
            <span>{label}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
