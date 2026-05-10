"use client";

import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { routes } from "@/utils/routes";

type Row = { tokenId: number; hash: string };

const PAGE_SIZE = 50;

export function ProvenanceTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => String(r.tokenId).includes(q) || r.hash.includes(q),
    );
  }, [rows, query]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const more = filtered.length > visible.length;

  return (
    <div className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-3">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by token ID or hash"
          className="w-full max-w-sm rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ww-pink)]/50"
        />
        <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground ml-auto">
          {filtered.length.toLocaleString()} / {rows.length.toLocaleString()}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr className="text-left">
              <Th>Token</Th>
              <Th>SHA-256 Hash</Th>
              <Th className="hidden md:table-cell">Links</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr
                key={r.tokenId}
                className="border-t border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-2.5 font-pixel text-[12px] tabular-nums">
                  #{r.tokenId}
                </td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground break-all">
                  {r.hash}
                </td>
                <td className="px-4 py-2.5 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <a
                      href={`${routes.external.openSeaWhaleBasePath}${r.tokenId}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--ww-pink)] transition-colors"
                    >
                      OpenSea <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href={`${routes.external.rawImageRoot600px}${r.tokenId}.png`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--ww-teal)] transition-colors"
                    >
                      Image <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href={`${routes.external.IPFSImage}${r.tokenId}.png`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--ww-purple)] transition-colors"
                    >
                      IPFS <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No matches.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {more && (
        <div className="border-t border-white/5 p-4 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-white/15 bg-white/5 px-4 py-2 font-pixel text-[10px] tracking-[0.18em] uppercase hover:bg-white/10 transition-colors"
          >
            Load {Math.min(PAGE_SIZE, filtered.length - visible.length)} more
          </button>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground ${className ?? ""}`}
    >
      {children}
    </th>
  );
}
