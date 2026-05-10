"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { WallpaperModal } from "./WallpaperModal";

export function WallpaperButton({
  whaleId,
  background,
}: {
  whaleId: number;
  background: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-3 font-pixel text-[11px] tracking-[0.18em] uppercase transition-colors hover:bg-white/10"
      >
        <Download className="h-4 w-4" />
        Download
      </button>
      <WallpaperModal
        open={open}
        onClose={() => setOpen(false)}
        whaleId={whaleId}
        background={background}
      />
    </>
  );
}
