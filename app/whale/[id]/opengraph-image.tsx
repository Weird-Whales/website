import { ImageResponse } from "next/og";
import allTraits from "@/utils/all-traits.json";
import { traitFrequency } from "@/utils/trait-frequency";
import { getRarityRank } from "@/utils/rarity";

export const alt = "Weird Whale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TOTAL_SUPPLY = 3350;

type WhaleTraits = {
  Background: string;
  Base: string;
  "Eye Accessory": string;
  Headgear: string;
  "Mouth Accessory": string;
  tokenId: number;
};

const BG_COLOR: Record<string, string> = {
  Pink: "#fa3c6b",
  "Baby Blue": "#9cb5fe",
  Cyan: "#67c7d0",
  Yellow: "#fad221",
  Orange: "#fc9144",
  Red: "#e02d4a",
  Purple: "#9f70dd",
  Peach: "#dec5a8",
};

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = Number(id);
  const whale = (allTraits as WhaleTraits[])[n];
  if (!whale) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#000",
            color: "#fff",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
          }}
        >
          Not found
        </div>
      ),
      size,
    );
  }

  const rank = getRarityRank(n);
  const baseCount =
    traitFrequency.Base[whale.Base as keyof typeof traitFrequency.Base];
  const basePct = ((baseCount / TOTAL_SUPPLY) * 100).toFixed(1);
  const accent = BG_COLOR[whale.Background] ?? "#fa3c6b";
  const whaleSrc = `https://raw.githubusercontent.com/Weird-Whales/images/main/optimized-images/600x600/${n}.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#000000",
          color: "#ffffff",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Accent gradient corner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "55%",
            height: "100%",
            background: `radial-gradient(circle at 70% 50%, ${accent}40 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        {/* Vertical accent strip */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 8,
            height: "100%",
            background: accent,
            display: "flex",
          }}
        />

        {/* Whale image panel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 540,
            height: "100%",
            paddingLeft: 60,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={whaleSrc}
            width={460}
            height={460}
            style={{
              borderRadius: 24,
              border: `4px solid ${accent}`,
            }}
            alt=""
          />
        </div>

        {/* Text panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingRight: 60,
            paddingLeft: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: accent,
              marginBottom: 10,
            }}
          >
            {`· Token #${n}`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            WEIRD WHALE
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#9aa0a6",
              marginBottom: 36,
            }}
          >
            {`${whale.Base} · ${whale.Background}`}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 28,
              marginBottom: 28,
            }}
          >
            <StatBlock
              label="Rank"
              labelColor="#fad221"
              value={`#${rank.toLocaleString()}`}
              sub={`of ${TOTAL_SUPPLY.toLocaleString()}`}
            />
            <StatBlock
              label={`${whale.Base}s`}
              labelColor="#67c7d0"
              value={baseCount.toLocaleString()}
              sub={`${basePct}% of supply`}
            />
          </div>

          {/* Bottom brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#9aa0a6",
              marginTop: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                background: accent,
                borderRadius: 3,
              }}
            />
            <div style={{ display: "flex" }}>weirdwhales.com</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

function StatBlock({
  label,
  labelColor,
  value,
  sub,
}: {
  label: string;
  labelColor: string;
  value: string;
  sub: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          fontSize: 16,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: labelColor,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 56,
          fontWeight: 900,
          lineHeight: 1.05,
        }}
      >
        {value}
      </div>
      <div style={{ display: "flex", fontSize: 16, color: "#9aa0a6" }}>
        {sub}
      </div>
    </div>
  );
}
