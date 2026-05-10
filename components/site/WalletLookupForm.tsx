"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const ENS_RE = /^[a-zA-Z0-9-]+\.eth$/;

export function WalletLookupForm({
  variant = "card",
}: {
  variant?: "card" | "inline";
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v) {
      setError("Paste a wallet address or .eth name");
      return;
    }
    if (!ADDRESS_RE.test(v) && !ENS_RE.test(v)) {
      setError("Not a valid address or .eth name");
      return;
    }
    router.push(`/wallet/${v.toLowerCase()}`);
  }

  if (variant === "inline") {
    return (
      <form onSubmit={onSubmit} className="flex w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder="0x… or yourname.eth"
            className="w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 py-2 text-sm font-mono outline-none focus:border-[var(--ww-pink)] transition-colors"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[var(--ww-pink)] px-4 py-2 font-pixel text-[10px] tracking-[0.18em] uppercase text-black hover:bg-[var(--ww-magenta)] transition-colors"
        >
          Look up
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
        · Wallet lookup
      </div>
      <div className="text-sm text-muted-foreground mb-4">
        Paste any address (or .eth name) to see what whales it&apos;s holding
        right now.
      </div>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder="0x… or yourname.eth"
            className="w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 py-2.5 text-sm font-mono outline-none focus:border-[var(--ww-pink)] transition-colors"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[var(--ww-pink)] px-4 py-2.5 font-pixel text-[10px] tracking-[0.18em] uppercase text-black hover:bg-[var(--ww-magenta)] transition-colors"
        >
          Look up
        </button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-[var(--ww-pink)]">{error}</p>
      )}
    </div>
  );
}
