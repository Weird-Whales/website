import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { routes } from "@/utils/routes";
import { cn } from "@/lib/utils";

export function whaleImageUrl(whaleID: number) {
  return `${routes.external.rawImageRoot600px}${whaleID}.png`;
}

export function whaleTransitionName(whaleID: number) {
  return `whale-${whaleID}`;
}

export function WhaleImage({
  whaleID,
  size = 240,
  isAnchor,
  className,
  priority,
  shared = true,
  responsive = false,
}: {
  whaleID: number;
  size?: number;
  isAnchor?: boolean;
  className?: string;
  priority?: boolean;
  /** Wrap in a ViewTransition for shared-element morphing across routes. */
  shared?: boolean;
  /**
   * Skip the inline width/height so the parent's className (e.g. `w-full
   * aspect-square`) controls the rendered size. `size` is still used for
   * the underlying image's intrinsic dimensions.
   */
  responsive?: boolean;
}) {
  const img = (
    <Image
      src={whaleImageUrl(whaleID)}
      alt={`Weird Whale #${whaleID}`}
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className="pixelated h-full w-full"
    />
  );

  const inner = (
    <span
      className={cn(
        "relative overflow-hidden rounded-2xl bg-black/40 border border-white/10",
        responsive ? "block" : "inline-block",
        className,
      )}
      style={responsive ? undefined : { width: size, height: size }}
    >
      {shared ? (
        <ViewTransition name={whaleTransitionName(whaleID)} share="morph">
          {img}
        </ViewTransition>
      ) : (
        img
      )}
    </span>
  );

  if (isAnchor) {
    return (
      <Link
        href={`${routes.internal.whale}${whaleID}`}
        className="group block transition-transform hover:-translate-y-1"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
