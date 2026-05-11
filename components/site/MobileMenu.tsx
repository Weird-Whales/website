"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { routes } from "@/utils/routes";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/story", label: "Story" },
  { href: "/stats", label: "Stats" },
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="md:hidden fixed inset-0 z-[100] bg-black backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-end px-4">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-md border border-white/15 bg-white/5 text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <motion.nav
            className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-12 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-pixel text-2xl tracking-[0.06em] uppercase text-foreground hover:text-[var(--ww-pink)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={routes.external.openSeaWWHome}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              className="mt-6 font-pixel text-[11px] tracking-[0.18em] uppercase rounded-md bg-[var(--ww-pink)] px-5 py-3 text-white hover:bg-[var(--ww-magenta)] transition-colors"
            >
              OpenSea
            </a>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden grid h-9 w-9 place-items-center rounded-md border border-white/15 bg-white/5 text-foreground hover:bg-white/10 transition-colors"
      >
        <Menu className="h-4 w-4" />
      </button>
      {typeof document !== "undefined" && createPortal(overlay, document.body)}
    </>
  );
}
