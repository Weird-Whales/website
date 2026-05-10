import Link from "next/link";
import { Logo } from "./Logo";
import { routes } from "@/utils/routes";

export function TopNav() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/70 backdrop-blur-xl"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo size={28} />
        <nav className="hidden md:flex items-center gap-6 text-[13px]">
          <Link
            href="/explore"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/story"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Story
          </Link>
          <Link
            href="/stats"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Stats
          </Link>
          <a
            href={routes.external.openSeaWWHome}
            target="_blank"
            rel="noreferrer noopener"
            className="font-pixel text-[10px] tracking-[0.16em] uppercase rounded-md border border-white/15 bg-white/5 px-3 py-1.5 hover:bg-[var(--ww-pink)] hover:border-[var(--ww-pink)] hover:text-white transition-colors"
          >
            OpenSea
          </a>
        </nav>
        {/* Mobile: just the OpenSea CTA */}
        <a
          href={routes.external.openSeaWWHome}
          target="_blank"
          rel="noreferrer noopener"
          className="md:hidden font-pixel text-[10px] tracking-[0.16em] uppercase rounded-md bg-[var(--ww-pink)] px-3 py-1.5 text-white"
        >
          OpenSea
        </a>
      </div>
    </header>
  );
}
