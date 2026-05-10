"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useCallback, ViewTransition } from "react";
import { ChevronDown, X, Search, Crown } from "lucide-react";
import {
  whaleImageUrl,
  whaleTransitionName,
} from "@/components/site/WhaleImage";
import { routes } from "@/utils/routes";

export type ExplorerWhale = {
  id: number;
  base: string;
  background: string;
  eye: string;
  headgear: string;
  mouth: string;
  rank: number;
  score: number;
};

type FilterGroups = {
  Base: string[];
  Background: string[];
  Eye: string[];
  Headgear: string[];
  Mouth: string[];
};

type Sort =
  | "rarity-asc" // rarest first (rank 1 first)
  | "rarity-desc" // most common first
  | "id-asc"
  | "id-desc";

const PAGE_SIZE = 60;

const BASE_ACCENT: Record<string, string> = {
  Alien: "var(--ww-teal)",
  Ape: "var(--ww-yellow)",
  Zombie: "var(--ww-purple)",
  Normal: "var(--ww-pink)",
};

export function Explorer({
  whales,
  filterGroups,
}: {
  whales: ExplorerWhale[];
  filterGroups: FilterGroups;
}) {
  const [filters, setFilters] = useState<{
    Base: Set<string>;
    Background: Set<string>;
    Eye: Set<string>;
    Headgear: Set<string>;
    Mouth: Set<string>;
  }>({
    Base: new Set(),
    Background: new Set(),
    Eye: new Set(),
    Headgear: new Set(),
    Mouth: new Set(),
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("rarity-asc");
  const [page, setPage] = useState(1);

  const toggleFilter = useCallback(
    (group: keyof FilterGroups, value: string) => {
      setFilters((prev) => {
        const next = { ...prev, [group]: new Set(prev[group]) };
        if (next[group].has(value)) next[group].delete(value);
        else next[group].add(value);
        return next;
      });
      setPage(1);
    },
    [],
  );

  const clearAll = useCallback(() => {
    setFilters({
      Base: new Set(),
      Background: new Set(),
      Eye: new Set(),
      Headgear: new Set(),
      Mouth: new Set(),
    });
    setQuery("");
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    const numericQ = q && /^\d+$/.test(q) ? Number(q) : null;
    return whales.filter((w) => {
      if (numericQ !== null && !String(w.id).includes(q)) return false;
      if (filters.Base.size && !filters.Base.has(w.base)) return false;
      if (filters.Background.size && !filters.Background.has(w.background))
        return false;
      if (filters.Eye.size && !filters.Eye.has(w.eye)) return false;
      if (filters.Headgear.size && !filters.Headgear.has(w.headgear))
        return false;
      if (filters.Mouth.size && !filters.Mouth.has(w.mouth)) return false;
      return true;
    });
  }, [whales, filters, query]);

  const sorted = useMemo(() => {
    const arr = filtered.slice();
    arr.sort((a, b) => {
      switch (sort) {
        case "rarity-asc":
          return a.rank - b.rank;
        case "rarity-desc":
          return b.rank - a.rank;
        case "id-asc":
          return a.id - b.id;
        case "id-desc":
          return b.id - a.id;
      }
    });
    return arr;
  }, [filtered, sort]);

  const visible = sorted.slice(0, page * PAGE_SIZE);
  const more = sorted.length > visible.length;

  const activeChips: { group: keyof FilterGroups; value: string }[] = [];
  (Object.keys(filters) as (keyof FilterGroups)[]).forEach((g) => {
    filters[g].forEach((v) => activeChips.push({ group: g, value: v }));
  });

  const hasAny = activeChips.length > 0 || query.length > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Filter sidebar */}
      <aside className="lg:sticky lg:top-20 lg:self-start space-y-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-3">
        <div className="flex items-center justify-between">
          <h2 className="font-pixel text-[11px] tracking-[0.2em] uppercase">
            Filters
          </h2>
          {hasAny && (
            <button
              onClick={clearAll}
              className="font-pixel text-[9px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground"
            >
              clear
            </button>
          )}
        </div>

        <FilterGroup
          label="Base"
          values={filterGroups.Base}
          selected={filters.Base}
          onToggle={(v) => toggleFilter("Base", v)}
          color="var(--ww-pink)"
        />
        <FilterGroup
          label="Background"
          values={filterGroups.Background}
          selected={filters.Background}
          onToggle={(v) => toggleFilter("Background", v)}
          color="var(--ww-sky)"
        />
        <FilterGroup
          label="Eye"
          values={filterGroups.Eye}
          selected={filters.Eye}
          onToggle={(v) => toggleFilter("Eye", v)}
          color="var(--ww-magenta)"
        />
        <FilterGroup
          label="Headgear"
          values={filterGroups.Headgear}
          selected={filters.Headgear}
          onToggle={(v) => toggleFilter("Headgear", v)}
          color="var(--ww-orange)"
        />
        <FilterGroup
          label="Mouth"
          values={filterGroups.Mouth}
          selected={filters.Mouth}
          onToggle={(v) => toggleFilter("Mouth", v)}
          color="var(--ww-coral)"
        />
      </aside>

      {/* Results */}
      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by token ID"
              className="w-full rounded-md border border-white/10 bg-black/40 pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ww-pink)]/50"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as Sort);
              setPage(1);
            }}
            className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ww-pink)]/50"
          >
            <option value="rarity-asc">Rarest first</option>
            <option value="rarity-desc">Least rare first</option>
            <option value="id-asc">Token ID ↑</option>
            <option value="id-desc">Token ID ↓</option>
          </select>
        </div>

        {/* Active chips */}
        {(activeChips.length > 0 || query) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {query && (
              <Chip onRemove={() => setQuery("")}>“{query}”</Chip>
            )}
            {activeChips.map(({ group, value }) => (
              <Chip
                key={`${group}-${value}`}
                onRemove={() => toggleFilter(group, value)}
              >
                {group}: {value}
              </Chip>
            ))}
          </div>
        )}

        {/* Count */}
        <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-4">
          {sorted.length.toLocaleString()} match
          {sorted.length === 1 ? "" : "es"}
        </div>

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-16 text-center">
            <p className="text-muted-foreground">
              No whales match these filters.
            </p>
            <button
              onClick={clearAll}
              className="mt-4 inline-flex rounded-md bg-[var(--ww-pink)] px-4 py-2 font-pixel text-[10px] tracking-[0.18em] uppercase text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {visible.map((w) => (
              <WhaleCard key={w.id} whale={w} />
            ))}
          </div>
        )}

        {more && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-white/15 bg-white/5 px-5 py-3 font-pixel text-[10px] tracking-[0.18em] uppercase hover:bg-white/10 transition-colors"
            >
              Load {Math.min(PAGE_SIZE, sorted.length - visible.length)} more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  values,
  selected,
  onToggle,
  color,
}: {
  label: string;
  values: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  color: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="group border-t border-white/5 pt-4"
    >
      <summary className="flex cursor-pointer items-center justify-between list-none">
        <span className="flex items-center gap-2 font-pixel text-[10px] tracking-[0.18em] uppercase">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: color }}
          />
          {label}
          {selected.size > 0 && (
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              ({selected.size})
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </summary>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {values.map((v) => {
          const active = selected.has(v);
          return (
            <button
              key={v}
              onClick={() => onToggle(v)}
              className={`rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                active
                  ? "border-transparent text-black"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
              style={
                active
                  ? { background: color, borderColor: color }
                  : undefined
              }
            >
              {v}
            </button>
          );
        })}
      </div>
    </details>
  );
}

function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 pl-2.5 pr-1 py-0.5 text-xs">
      {children}
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-white/10"
        aria-label="Remove filter"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function WhaleCard({ whale }: { whale: ExplorerWhale }) {
  const accent = BASE_ACCENT[whale.base] ?? "var(--ww-pink)";
  return (
    <Link
      href={`${routes.internal.whale}${whale.id}`}
      className="group relative block overflow-hidden rounded-lg border border-white/10 bg-card/50 transition-all hover:-translate-y-0.5"
      style={{ ["--whale-accent" as string]: accent }}
    >
      <div className="relative aspect-square overflow-hidden">
        <ViewTransition name={whaleTransitionName(whale.id)} share="morph">
          <Image
            src={whaleImageUrl(whale.id)}
            alt={`Whale #${whale.id}`}
            width={200}
            height={200}
            unoptimized
            loading="lazy"
            className="pixelated h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        </ViewTransition>
        <div
          className="pointer-events-none absolute inset-0 ring-0 transition-shadow group-hover:ring-2"
          style={{ boxShadow: "inset 0 0 0 0 var(--whale-accent)" }}
        />
      </div>
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <span className="font-pixel text-[10px] tabular-nums text-foreground">
          #{whale.id}
        </span>
        <span
          className="inline-flex items-center gap-0.5 font-pixel text-[9px] tabular-nums"
          style={{ color: accent }}
        >
          <Crown className="h-2.5 w-2.5" />
          {whale.rank}
        </span>
      </div>
    </Link>
  );
}
