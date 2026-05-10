"use client";

import { useMemo, useState } from "react";
import type { SalesDay } from "./FloorHistoryChart";
import { SmartTooltip } from "./SmartTooltip";
import { useCurrency } from "./CurrencyProvider";

type HoverCell = {
  ts: number;
  data: SalesDay | null;
  clientX: number;
  clientY: number;
};

const DAY = 24 * 60 * 60 * 1000;
const CELL = 11;
const GAP = 2;

function dayKey(d: Date) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function SalesCalendar({ days }: { days: SalesDay[] }) {
  const years = useMemo(() => {
    if (days.length === 0) return [];
    const byYear = new Map<number, SalesDay[]>();
    for (const d of days) {
      const y = new Date(d.ts).getUTCFullYear();
      let arr = byYear.get(y);
      if (!arr) {
        arr = [];
        byYear.set(y, arr);
      }
      arr.push(d);
    }
    return Array.from(byYear.keys()).sort((a, b) => b - a);
  }, [days]);

  const [selectedYear, setSelectedYear] = useState<number | null>(
    years[0] ?? null,
  );
  const [hover, setHover] = useState<HoverCell | null>(null);
  const { format } = useCurrency();

  const yearData = useMemo(() => {
    if (selectedYear == null) return null;

    const map = new Map<number, SalesDay>();
    for (const d of days) {
      if (new Date(d.ts).getUTCFullYear() === selectedYear) {
        map.set(d.ts, d);
      }
    }

    // Compute max sales for color scaling.
    let maxSales = 0;
    for (const d of map.values()) maxSales = Math.max(maxSales, d.sales);

    // Build a 53-week × 7-day grid for that year.
    const start = new Date(Date.UTC(selectedYear, 0, 1));
    const end = new Date(Date.UTC(selectedYear, 11, 31));

    // Anchor to the Sunday on/before Jan 1.
    const startDayOfWeek = start.getUTCDay();
    const gridStart = new Date(start.getTime() - startDayOfWeek * DAY);

    const weeks: Array<Array<{ ts: number; data: SalesDay | null; inYear: boolean }>> = [];
    let cur = new Date(gridStart);
    while (cur <= end || cur.getUTCDay() !== 0) {
      const week: typeof weeks[number] = [];
      for (let dow = 0; dow < 7; dow++) {
        const ts = dayKey(cur);
        week.push({
          ts,
          data: map.get(ts) ?? null,
          inYear: cur.getUTCFullYear() === selectedYear,
        });
        cur = new Date(cur.getTime() + DAY);
      }
      weeks.push(week);
      if (weeks.length > 54) break;
    }

    // Year totals.
    let totalSales = 0;
    let totalVolume = 0;
    for (const d of map.values()) {
      totalSales += d.sales;
      totalVolume += d.volume;
    }

    // Month label positions: x = first column where the month starts.
    const monthLabels: { x: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      for (const cell of week) {
        if (!cell.inYear) continue;
        const m = new Date(cell.ts).getUTCMonth();
        if (m !== lastMonth) {
          lastMonth = m;
          monthLabels.push({
            x: wi * (CELL + GAP),
            label: MONTHS_SHORT[m],
          });
        }
        break;
      }
    });

    return { weeks, maxSales, totalSales, totalVolume, monthLabels };
  }, [days, selectedYear]);

  if (years.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
            · Sales calendar
          </div>
          <div className="text-sm text-muted-foreground">
            {yearData ? (
              <>
                <span className="text-foreground/70">
                  {yearData.totalSales.toLocaleString()} sales
                </span>{" "}
                ·{" "}
                <span className="text-foreground/70">
                  {format(yearData.totalVolume)}
                </span>{" "}
                in {selectedYear}
              </>
            ) : (
              "Select a year"
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`font-pixel text-[10px] tracking-[0.18em] uppercase rounded px-2.5 py-1.5 transition-colors ${
                selectedYear === y
                  ? "bg-[var(--ww-teal)] text-black"
                  : "bg-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {yearData && (
        <div className="relative overflow-x-auto pb-2">
          <svg
            width={yearData.weeks.length * (CELL + GAP) + 16}
            height={7 * (CELL + GAP) + 22}
            onMouseLeave={() => setHover(null)}
          >
            {yearData.monthLabels.map((m, i) => (
              <text
                key={i}
                x={m.x}
                y={9}
                className="fill-muted-foreground"
                style={{
                  font: "9px ui-monospace, monospace",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </text>
            ))}
            {yearData.weeks.map((week, wi) =>
              week.map((cell, dow) => {
                const intensity = cell.data
                  ? Math.min(1, cell.data.sales / Math.max(1, yearData.maxSales))
                  : 0;
                const bg = !cell.inYear
                  ? "rgba(255,255,255,0.02)"
                  : !cell.data
                    ? "rgba(255,255,255,0.05)"
                    : `rgba(250, 60, 107, ${0.18 + intensity * 0.82})`;
                const x = wi * (CELL + GAP);
                const y = dow * (CELL + GAP) + 14;
                const isHovered =
                  hover != null && hover.ts === cell.ts && cell.inYear;
                return (
                  <rect
                    key={`${wi}-${dow}`}
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={2}
                    fill={bg}
                    stroke={isHovered ? "white" : "none"}
                    strokeOpacity={isHovered ? 0.8 : 0}
                    strokeWidth={isHovered ? 1.2 : 0}
                    style={{ cursor: cell.inYear ? "crosshair" : "default" }}
                    onMouseEnter={(e) => {
                      if (!cell.inYear) return;
                      const r = (
                        e.currentTarget as SVGRectElement
                      ).getBoundingClientRect();
                      setHover({
                        ts: cell.ts,
                        data: cell.data,
                        clientX: r.left + r.width / 2,
                        clientY: r.top,
                      });
                    }}
                  />
                );
              }),
            )}
          </svg>

          {hover && (
            <SmartTooltip clientX={hover.clientX} clientY={hover.clientY}>
              <CalendarTooltipContent
                ts={hover.ts}
                data={hover.data}
                format={format}
              />
            </SmartTooltip>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-[10px] font-pixel tracking-[0.18em] uppercase text-muted-foreground">
        <span>Less</span>
        {[0.18, 0.4, 0.6, 0.8, 1].map((o) => (
          <span
            key={o}
            className="inline-block h-2.5 w-2.5 rounded-[2px]"
            style={{ background: `rgba(250, 60, 107, ${o})` }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function CalendarTooltipContent({
  ts,
  data,
  format,
}: {
  ts: number;
  data: SalesDay | null;
  format: (eth: number, opts?: { decimals?: number; showSymbol?: boolean }) => string;
}) {
  const date = new Date(ts);
  const dateLabel = `${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  return (
    <div className="rounded-lg border border-white/15 bg-black/90 backdrop-blur-md px-3 py-2 shadow-xl whitespace-nowrap">
      <div className="font-pixel text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
        {dateLabel}
      </div>
      {data ? (
        <div className="flex items-baseline gap-3">
          <span className="font-pixel text-[11px] tabular-nums text-[var(--ww-pink)]">
            {data.sales} sale{data.sales === 1 ? "" : "s"}
          </span>
          <span className="font-pixel text-[11px] tabular-nums text-foreground">
            {format(data.volume)}
          </span>
          <span className="font-pixel text-[10px] tabular-nums text-muted-foreground">
            avg {format(data.avg)}
          </span>
        </div>
      ) : (
        <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          no sales
        </div>
      )}
    </div>
  );
}
