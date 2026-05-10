import "server-only";

export type EthRates = {
  usd: number;
  gbp: number;
  /** ISO timestamp the rates were last fetched. */
  updatedAt: string;
};

const FALLBACK: EthRates = {
  usd: 3000,
  gbp: 2400,
  updatedAt: new Date(0).toISOString(),
};

const REVALIDATE = 600; // 10 min

/**
 * Fetches ETH → USD/GBP from CoinGecko's free public endpoint.
 * Falls back to a sane default if the request fails - the user can
 * still switch back to ETH and see real values.
 */
export async function getEthRates(): Promise<EthRates> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,gbp",
      { next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return FALLBACK;
    const j = (await res.json()) as {
      ethereum?: { usd?: number; gbp?: number };
    };
    const usd = j?.ethereum?.usd;
    const gbp = j?.ethereum?.gbp;
    if (!usd || !gbp) return FALLBACK;
    return { usd, gbp, updatedAt: new Date().toISOString() };
  } catch {
    return FALLBACK;
  }
}
