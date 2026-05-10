import { ExternalLink } from "lucide-react";

export type MediaItem = {
  outlet: string; // e.g. "BBC News"
  title: string; // headline
  date: string; // "Aug 2021"
  url: string;
  /** Optional 1-line accent description */
  detail?: string;
  /** Hex color for the outlet pill */
  color?: string;
};

const FALLBACK_COLORS = [
  "var(--ww-pink)",
  "var(--ww-purple)",
  "var(--ww-teal)",
  "var(--ww-yellow)",
  "var(--ww-orange)",
  "var(--ww-sky)",
];

export function MediaGrid({ items }: { items: MediaItem[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {items.map((m, i) => {
        const accent = m.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
        return (
          <li key={m.url}>
            <a
              href={m.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative block h-full overflow-hidden rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5"
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: accent }}
              />
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="inline-flex items-center rounded font-pixel text-[10px] tracking-[0.18em] uppercase px-2 py-1 text-black"
                  style={{ background: accent }}
                >
                  {m.outlet}
                </span>
                <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                  {m.date}
                </span>
              </div>
              <div className="text-sm font-medium text-foreground leading-snug">
                {m.title}
              </div>
              {m.detail && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {m.detail}
                </div>
              )}
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                read <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
