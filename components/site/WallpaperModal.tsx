"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { X, Download, Smartphone, Monitor, Circle, Square } from "lucide-react";

type Format = "phone" | "desktop" | "circle" | "square";

const FORMATS: Array<{
  id: Format;
  label: string;
  width: number;
  height: number;
  Icon: typeof Smartphone;
  description: string;
}> = [
  {
    id: "phone",
    label: "Phone",
    width: 1290,
    height: 2796,
    Icon: Smartphone,
    description: "Lock-screen wallpaper · 1290 × 2796",
  },
  {
    id: "desktop",
    label: "Desktop",
    width: 2560,
    height: 1440,
    Icon: Monitor,
    description: "1440p widescreen · 2560 × 1440",
  },
  {
    id: "square",
    label: "Square",
    width: 1080,
    height: 1080,
    Icon: Square,
    description: "Twitter / Instagram · 1080 × 1080",
  },
  {
    id: "circle",
    label: "Circle PFP",
    width: 1024,
    height: 1024,
    Icon: Circle,
    description: "Profile picture · 1024 × 1024",
  },
];

// Sampled directly from the actual NFT background pixels.
const BG_COLOR: Record<string, string> = {
  "Baby Blue": "#9cb5fe",
  Cyan: "#67c7d0",
  Orange: "#fc9144",
  Peach: "#dec5a8",
  Pink: "#fd9dcb",
  Purple: "#9f70dd",
  Red: "#fa3c6b",
  Yellow: "#fad221",
};

const PIXEL_FONT = '"Press Start 2P", ui-monospace, monospace';

export function WallpaperModal({
  open,
  onClose,
  whaleId,
  background,
}: {
  open: boolean;
  onClose: () => void;
  whaleId: number;
  background: string;
}) {
  const [busy, setBusy] = useState<Format | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Preload the whale image once when the modal opens. We pull it through
  // our own /api/whale-image proxy because GitHub raw doesn't send the
  // Access-Control-Allow-Origin header canvas needs to avoid tainting.
  useEffect(() => {
    if (!open) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `/api/whale-image/${whaleId}`;
    imgRef.current = img;
  }, [open, whaleId]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function download(format: Format) {
    const fmt = FORMATS.find((f) => f.id === format)!;
    setBusy(format);
    try {
      // Wait for image and font to be ready
      const img = imgRef.current;
      if (!img) throw new Error("Image not loaded");
      if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Image failed to load"));
        });
      }
      // Make sure the pixel font is rasterised before we draw text - first
      // load on a fresh visit otherwise falls back to monospace.
      try {
        await document.fonts.load(`bold 48px ${PIXEL_FONT}`);
      } catch {
        // ignore - we'll fall back to the system monospace
      }

      const bgColor = BG_COLOR[background] ?? "#fa3c6b";

      const canvas = document.createElement("canvas");
      canvas.width = fmt.width;
      canvas.height = fmt.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // Solid NFT-background colour fill
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, fmt.width, fmt.height);

      // Chunky pixels (nearest-neighbour)
      ctx.imageSmoothingEnabled = false;

      if (format === "circle") {
        // Whale clipped to circle, slim ring in same colour as bg edge
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          fmt.width / 2,
          fmt.height / 2,
          fmt.width / 2 - 16,
          0,
          Math.PI * 2,
        );
        ctx.clip();
        ctx.drawImage(img, 0, 0, fmt.width, fmt.height);
        ctx.restore();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(
          fmt.width / 2,
          fmt.height / 2,
          fmt.width / 2 - 16,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      } else if (format === "square") {
        // Whale fills the frame edge to edge - like the OpenSea tile
        ctx.drawImage(img, 0, 0, fmt.width, fmt.height);
        // Subtle bottom token label
        const padding = 36;
        ctx.font = `28px ${PIXEL_FONT}`;
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "left";
        const text = `#${whaleId}`;
        const metrics = ctx.measureText(text);
        const labelW = metrics.width + 36;
        const labelH = 48;
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(padding, fmt.height - padding - labelH, labelW, labelH);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          text,
          padding + 18,
          fmt.height - padding - labelH / 2 + 10,
        );
      } else {
        // Phone or desktop: large whale on solid colour, branded label below.
        // Phone: whale centred vertically, label anchored to the bottom.
        // Desktop: same composition but tighter - kept centred-ish.
        const isPhone = format === "phone";
        const target = Math.floor(
          Math.min(fmt.width, fmt.height) * (isPhone ? 0.82 : 0.62),
        );
        const x = Math.floor((fmt.width - target) / 2);
        const y = isPhone
          ? Math.floor((fmt.height - target) / 2)
          : Math.floor((fmt.height - target) / 2 - fmt.height * 0.04);
        ctx.drawImage(img, x, y, target, target);

        // Branded label - anchored to the bottom on phone (200px above the
        // edge, leaves room for the home indicator), centred-below on desktop.
        const titleSize = isPhone ? 56 : 48;
        const subSize = isPhone ? 22 : 20;
        ctx.font = `${titleSize}px ${PIXEL_FONT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#000000";
        const titleY = isPhone
          ? fmt.height - 240
          : y + target + 140;
        ctx.fillText(`WEIRD WHALE #${whaleId}`, fmt.width / 2, titleY);

        ctx.font = `${subSize}px ${PIXEL_FONT}`;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillText(
          "WEIRDWHALES.COM",
          fmt.width / 2,
          titleY + (isPhone ? 60 : 48),
        );
        ctx.textAlign = "start";
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
      if (!blob) throw new Error("Could not generate image");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `weird-whale-${whaleId}-${format}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Wallpaper download failed:", e);
      alert("Couldn't generate the image. Try again or check the console.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-pink)] mb-1">
              · Download
            </div>
            <h2 className="font-pixel text-xl tracking-[0.04em] mb-1">
              WHALE #{whaleId}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Pick a size - generated locally in your browser, downloads
              instantly.
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {FORMATS.map((f) => {
                const active = busy === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => download(f.id)}
                    disabled={busy != null}
                    className="group relative flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-3 text-left transition-colors hover:border-[var(--ww-pink)]/50 hover:bg-[var(--ww-pink)]/5 disabled:opacity-50"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5">
                      <f.Icon className="h-4 w-4 text-[var(--ww-pink)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-foreground">
                        {f.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {f.description}
                      </div>
                    </div>
                    <Download
                      className={`h-4 w-4 shrink-0 transition-opacity ${
                        active
                          ? "opacity-100 animate-pulse"
                          : "opacity-30 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-[10px] text-muted-foreground">
              Original 600×600 image upscaled with chunky pixel scaling - no
              blurring.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
