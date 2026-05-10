"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Floating tooltip that auto-clamps to the viewport and flips above/below
 * if there isn't room. Portals to <body> so transforms or overflow:hidden on
 * any ancestor can't clip it.
 *
 * Pass viewport (clientX/Y) coordinates - the same numbers `e.clientX/Y`
 * give you. The tooltip will measure itself after mount and nudge its
 * position so it stays fully on-screen.
 */
export function SmartTooltip({
  clientX,
  clientY,
  place = "top",
  children,
}: {
  clientX: number;
  clientY: number;
  place?: "top" | "bottom";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    left: number;
    top: number;
    ready: boolean;
  }>({ left: clientX, top: clientY, ready: false });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const offset = 14;

    let left = clientX - w / 2;
    if (left < margin) left = margin;
    if (left + w > vw - margin) left = vw - w - margin;

    let top = place === "top" ? clientY - h - offset : clientY + offset;
    // Flip if no room above
    if (place === "top" && top < margin) top = clientY + offset;
    // Final clamp
    if (top + h > vh - margin) top = vh - h - margin;
    if (top < margin) top = margin;

    setPos({ left, top, ready: true });
  }, [clientX, clientY, place]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        opacity: pos.ready ? 1 : 0,
        transition: "opacity 80ms",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
