import Image from "next/image";
import { whaleImageUrl } from "./WhaleImage";

export function TypeCard({
  name,
  count,
  total,
  sampleId,
  href,
  color,
}: {
  name: string;
  count: number;
  total: number;
  sampleId: number;
  href: string;
  /** Hex string sampled from the actual NFT body pixels. */
  color: string;
}) {
  const pct = ((count / total) * 100).toFixed(1);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative flex flex-col gap-3 rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:[box-shadow:6px_6px_0_0_var(--type-color)]"
      style={
        {
          // Custom property so the hover shadow can use the dynamic color.
          "--type-color": color,
        } as React.CSSProperties
      }
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-lg ring-1"
        style={{ "--tw-ring-color": `${color}66` } as React.CSSProperties}
      >
        <Image
          src={whaleImageUrl(sampleId)}
          alt={`${name} whale sample`}
          width={300}
          height={300}
          unoptimized
          className="pixelated h-full w-full"
        />
        <div
          className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: `${color}1a` }}
        />
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1">
            Type
          </div>
          <div
            className="text-xl font-semibold"
            style={{ color }}
          >
            {name}
          </div>
        </div>
        <div className="text-right">
          <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1">
            Count
          </div>
          <div className="font-pixel text-[12px] text-foreground">
            {count.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">{pct}%</div>
        </div>
      </div>
    </a>
  );
}
