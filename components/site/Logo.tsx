import Image from "next/image";
import Link from "next/link";

export function Logo({
  size = 36,
  showWordmark = true,
}: {
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group"
      aria-label="Weird Whales home"
    >
      <Image
        src="/ww-logo.png"
        alt=""
        width={size}
        height={size}
        priority
        className="pixelated rounded-full transition-transform group-hover:rotate-[-6deg]"
      />
      {showWordmark && (
        <span className="font-pixel text-[11px] tracking-[0.18em] text-foreground">
          WEIRD&nbsp;WHALES
        </span>
      )}
    </Link>
  );
}
