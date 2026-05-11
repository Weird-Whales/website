import Image from "next/image";
import { Reveal } from "./Reveal";
import type { ReactNode } from "react";

const ACCENTS = {
  pink: "var(--ww-pink)",
  purple: "var(--ww-purple)",
  teal: "var(--ww-teal)",
  yellow: "var(--ww-yellow)",
  orange: "var(--ww-orange)",
  sky: "var(--ww-sky)",
} as const;

export type EraCardProps = {
  index: number;
  title: string;
  dateRange: string;
  /** Omit to render a solid black circle (e.g. for an "anonymous" era). */
  pfp?: string;
  pfpAlt?: string;
  accent: keyof typeof ACCENTS;
  blurb?: string;
  /** CSS object-position for the circular PFP crop. Default "center". */
  pfpPosition?: string;
  children: ReactNode;
};

export function EraCard({
  index,
  title,
  dateRange,
  pfp,
  pfpAlt,
  accent,
  blurb,
  pfpPosition,
  children,
}: EraCardProps) {
  const color = ACCENTS[accent];
  const padded = String(index).padStart(2, "0");

  return (
    <article className="relative">
      <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        {/* PFP rail */}
        <Reveal>
          <div className="md:sticky md:top-24 md:self-start text-center md:text-left">
            <div
              className="relative inline-block rounded-full p-1.5"
              style={{ background: color }}
            >
              <div className="relative h-40 w-40 overflow-hidden rounded-full bg-black">
                {pfp && (
                  <Image
                    src={pfp}
                    alt={pfpAlt ?? ""}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                    style={
                      pfpPosition ? { objectPosition: pfpPosition } : undefined
                    }
                  />
                )}
              </div>
              <span
                className="absolute -bottom-2 -right-2 rounded-md px-2 py-1 font-pixel text-[10px] tracking-[0.18em] uppercase text-black"
                style={{ background: color }}
              >
                Era {padded}
              </span>
            </div>
            <h3
              className="mt-5 font-pixel text-base leading-tight tracking-[0.04em]"
              style={{ color }}
            >
              {title}
            </h3>
            <p className="mt-1 font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              {dateRange}
            </p>
            {blurb && (
              <p className="mt-3 text-sm text-muted-foreground max-w-[260px] mx-auto md:mx-0 md:max-w-[200px]">
                {blurb}
              </p>
            )}
          </div>
        </Reveal>

        {/* Era content */}
        <Reveal delay={0.05}>
          <div>{children}</div>
        </Reveal>
      </div>
    </article>
  );
}
