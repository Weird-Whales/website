import type { ReactNode } from "react";

const ACCENTS = {
  pink: "var(--ww-pink)",
  purple: "var(--ww-purple)",
  teal: "var(--ww-teal)",
  yellow: "var(--ww-yellow)",
  orange: "var(--ww-orange)",
  sky: "var(--ww-sky)",
} as const;

export type ChapterProps = {
  title: string;
  dateRange: string;
  accent: keyof typeof ACCENTS;
  blurb?: string;
  children: ReactNode;
};

/**
 * A sub-section under an Era. Renders a small kicker (date) + chapter
 * title in the accent colour, with optional blurb and content below.
 * Designed to sit inside the right-hand column of an EraCard so multiple
 * chapters share one PFP rail.
 */
export function Chapter({
  title,
  dateRange,
  accent,
  blurb,
  children,
}: ChapterProps) {
  const color = ACCENTS[accent];
  return (
    <section className="space-y-5">
      <div className="text-center md:text-left">
        <div
          className="font-pixel text-[10px] tracking-[0.2em] uppercase mb-2"
          style={{ color }}
        >
          · {dateRange}
        </div>
        <h3
          className="font-pixel text-2xl tracking-[0.04em] leading-tight"
          style={{ color }}
        >
          {title}
        </h3>
        {blurb && (
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto md:mx-0">
            {blurb}
          </p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
