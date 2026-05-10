import "server-only";

const COLLECTION_SLUG = "weirdwhales";
const CONTRACT_ADDRESS = "0x96ed81c7f4406eff359e27bff6325dc3c9e042bd";
const CHAIN = "ethereum";
const BASE_URL = "https://api.opensea.io/api/v2";

const REVALIDATE_STATS = 60; // 1 minute - collection-wide numbers
const REVALIDATE_NFT = 120; // 2 minutes - per-whale data

function apiKey() {
  return process.env.OPENSEA_API_KEY ?? "";
}

async function osFetch<T>(
  path: string,
  revalidate: number,
): Promise<T | null> {
  const key = apiKey();
  if (!key) return null;
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "X-API-KEY": key, Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ---------- Collection stats ----------

export type CollectionStats = {
  floorPriceEth: number | null;
  floorSymbol: string;
  totalVolumeEth: number | null;
  numOwners: number | null;
  totalSupply: number | null;
  oneDayVolumeEth: number | null;
  oneDaySales: number | null;
  oneDayAveragePriceEth: number | null;
};

type RawStats = {
  total?: {
    volume?: number;
    num_owners?: number;
    floor_price?: number;
    floor_price_symbol?: string;
    market_cap?: number;
  };
  intervals?: Array<{
    interval?: string;
    volume?: number;
    sales?: number;
    average_price?: number;
  }>;
  // Some endpoints return supply at the collection level
};

type RawCollection = {
  total_supply?: number;
};

export async function getCollectionStats(): Promise<CollectionStats | null> {
  const [stats, collection] = await Promise.all([
    osFetch<RawStats>(
      `/collections/${COLLECTION_SLUG}/stats`,
      REVALIDATE_STATS,
    ),
    osFetch<RawCollection>(`/collections/${COLLECTION_SLUG}`, REVALIDATE_STATS),
  ]);
  if (!stats) return null;
  const oneDay = stats.intervals?.find((i) => i.interval === "one_day");
  return {
    floorPriceEth: stats.total?.floor_price ?? null,
    floorSymbol: stats.total?.floor_price_symbol ?? "ETH",
    totalVolumeEth: stats.total?.volume ?? null,
    numOwners: stats.total?.num_owners ?? null,
    totalSupply: collection?.total_supply ?? null,
    oneDayVolumeEth: oneDay?.volume ?? null,
    oneDaySales: oneDay?.sales ?? null,
    oneDayAveragePriceEth: oneDay?.average_price ?? null,
  };
}

// ---------- NFT details ----------

export type WhaleLiveInfo = {
  owner: string | null;
  bestListing: {
    priceEth: number;
    priceSymbol: string;
    marketplace: string;
  } | null;
  lastSale: {
    priceEth: number;
    priceSymbol: string;
    timestamp: string;
    fromAddress: string | null;
  } | null;
  /** OpenRarity rank from OpenSea (1 = rarest). Null if unavailable. */
  rarityRank: number | null;
  rarityStrategy: string | null;
};

type RawNftResponse = {
  nft?: {
    identifier?: string;
    owners?: Array<{ address?: string; quantity?: number }>;
    rarity?: {
      strategy_id?: string;
      rank?: number;
    };
  };
};

type RawListingsResponse = {
  listings?: Array<{
    price?: {
      current?: { value?: string; decimals?: number; currency?: string };
    };
    protocol_address?: string;
  }>;
};

type RawEventsResponse = {
  asset_events?: Array<{
    event_type?: string;
    payment?: { quantity?: string; decimals?: number; symbol?: string };
    event_timestamp?: number;
    from_address?: string;
    seller?: string;
  }>;
};

function rawAmountToEth(value: string, decimals: number): number {
  // Avoid BigInt precision issues by dividing through Number - fine for ETH magnitudes
  const v = Number(value);
  return v / 10 ** decimals;
}

export async function getWhaleLiveInfo(
  tokenId: number,
): Promise<WhaleLiveInfo | null> {
  const [nft, bestListings, recentEvents] = await Promise.all([
    osFetch<RawNftResponse>(
      `/chain/${CHAIN}/contract/${CONTRACT_ADDRESS}/nfts/${tokenId}`,
      REVALIDATE_NFT,
    ),
    osFetch<RawListingsResponse>(
      `/listings/collection/${COLLECTION_SLUG}/nfts/${tokenId}/best`,
      REVALIDATE_NFT,
    ),
    osFetch<RawEventsResponse>(
      `/events/chain/${CHAIN}/contract/${CONTRACT_ADDRESS}/nfts/${tokenId}?event_type=sale&limit=1`,
      REVALIDATE_NFT,
    ),
  ]);

  if (!nft && !bestListings && !recentEvents) return null;

  const owner = nft?.nft?.owners?.[0]?.address ?? null;
  const rarityRank = nft?.nft?.rarity?.rank ?? null;
  const rarityStrategy = nft?.nft?.rarity?.strategy_id ?? null;

  const firstListing = bestListings?.listings?.[0];
  let bestListing: WhaleLiveInfo["bestListing"] = null;
  if (firstListing?.price?.current?.value) {
    const value = firstListing.price.current.value;
    const decimals = firstListing.price.current.decimals ?? 18;
    bestListing = {
      priceEth: rawAmountToEth(value, decimals),
      priceSymbol: firstListing.price.current.currency ?? "ETH",
      marketplace: firstListing.protocol_address ? "OpenSea" : "OpenSea",
    };
  }

  const saleEvent = recentEvents?.asset_events?.[0];
  let lastSale: WhaleLiveInfo["lastSale"] = null;
  if (saleEvent?.payment?.quantity && saleEvent.event_timestamp) {
    lastSale = {
      priceEth: rawAmountToEth(
        saleEvent.payment.quantity,
        saleEvent.payment.decimals ?? 18,
      ),
      priceSymbol: saleEvent.payment.symbol ?? "ETH",
      timestamp: new Date(saleEvent.event_timestamp * 1000).toISOString(),
      fromAddress: saleEvent.seller ?? saleEvent.from_address ?? null,
    };
  }

  return { owner, bestListing, lastSale, rarityRank, rarityStrategy };
}

// ---------- Recent sales feed ----------

export type RecentSale = {
  tokenId: number;
  priceEth: number;
  priceSymbol: string;
  timestamp: string;
  seller: string | null;
  buyer: string | null;
};

type RawSalesEvents = {
  asset_events?: Array<{
    event_type?: string;
    nft?: { identifier?: string };
    payment?: { quantity?: string; decimals?: number; symbol?: string };
    event_timestamp?: number;
    seller?: string;
    buyer?: string;
    from_address?: string;
    to_address?: string;
  }>;
};

const REVALIDATE_SALES = 90; // 1.5 min

export async function getRecentSales(limit = 10): Promise<RecentSale[]> {
  const data = await osFetch<RawSalesEvents>(
    `/events/collection/${COLLECTION_SLUG}?event_type=sale&limit=${limit}`,
    REVALIDATE_SALES,
  );
  const events = data?.asset_events ?? [];
  const result: RecentSale[] = [];
  for (const ev of events) {
    const idStr = ev.nft?.identifier;
    const qty = ev.payment?.quantity;
    if (!idStr || !qty || !ev.event_timestamp) continue;
    const tokenId = Number(idStr);
    if (!Number.isFinite(tokenId)) continue;
    result.push({
      tokenId,
      priceEth: rawAmountToEth(qty, ev.payment?.decimals ?? 18),
      priceSymbol: ev.payment?.symbol ?? "ETH",
      timestamp: new Date(ev.event_timestamp * 1000).toISOString(),
      seller: ev.seller ?? ev.from_address ?? null,
      buyer: ev.buyer ?? ev.to_address ?? null,
    });
  }
  return result;
}

// ---------- Sales since timestamp (delta fetch) ----------

export type SaleEvent = {
  tokenId: number;
  priceEth: number;
  symbol: string;
  ts: number;
  seller: string | null;
  buyer: string | null;
};

const ETH_SYMBOLS = new Set(["ETH", "WETH"]);
const REVALIDATE_DELTA = 600; // 10 min

/**
 * Fetches sale events newer than `sinceTs` (epoch ms). Walks the events
 * API in descending order and stops as soon as it sees an event at or
 * before `sinceTs`. Capped at `maxPages` so a stale baseline can't blow
 * out the Netlify function timeout.
 */
export async function getSalesSince(
  sinceTs: number,
  maxPages = 6,
): Promise<SaleEvent[]> {
  const results: SaleEvent[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < maxPages; page++) {
    const url =
      `/events/collection/${COLLECTION_SLUG}` +
      `?event_type=sale&limit=50` +
      (cursor ? `&next=${encodeURIComponent(cursor)}` : "");
    const data = await osFetch<RawSalesEvents & { next?: string }>(
      url,
      REVALIDATE_DELTA,
    );
    const events = data?.asset_events ?? [];
    if (events.length === 0) break;
    let hitOldEnough = false;
    for (const ev of events) {
      const tsSec = ev.event_timestamp;
      if (!tsSec) continue;
      const tsMs = tsSec * 1000;
      if (tsMs <= sinceTs) {
        hitOldEnough = true;
        break;
      }
      const sym = ev.payment?.symbol;
      const qty = ev.payment?.quantity;
      const idStr = ev.nft?.identifier;
      if (!sym || !ETH_SYMBOLS.has(sym)) continue;
      if (!qty || !idStr) continue;
      const tokenId = Number(idStr);
      if (!Number.isFinite(tokenId)) continue;
      const priceEth = rawAmountToEth(qty, ev.payment?.decimals ?? 18);
      if (!Number.isFinite(priceEth) || priceEth <= 0) continue;
      results.push({
        tokenId,
        priceEth,
        symbol: sym,
        ts: tsMs,
        seller: ev.seller ?? ev.from_address ?? null,
        buyer: ev.buyer ?? ev.to_address ?? null,
      });
    }
    if (hitOldEnough) break;
    cursor = (data as { next?: string } | null)?.next;
    if (!cursor) break;
  }
  results.sort((a, b) => a.ts - b.ts);
  return results;
}

// ---------- Active listings feed ----------

export type ActiveListing = {
  tokenId: number;
  priceEth: number;
  priceSymbol: string;
  seller: string | null;
  startTime: string | null;
  expirationTime: string | null;
};

type RawListingsAll = {
  listings?: Array<{
    order_hash?: string;
    protocol_data?: {
      parameters?: {
        offerer?: string;
        startTime?: string;
        endTime?: string;
        offer?: Array<{ identifierOrCriteria?: string; token?: string }>;
      };
    };
    price?: {
      current?: { value?: string; decimals?: number; currency?: string };
    };
  }>;
  next?: string;
};

const REVALIDATE_LISTINGS = 60;

export async function getActiveListings(limit = 50): Promise<ActiveListing[]> {
  const data = await osFetch<RawListingsAll>(
    `/listings/collection/${COLLECTION_SLUG}/all?limit=${limit}`,
    REVALIDATE_LISTINGS,
  );
  const items = data?.listings ?? [];
  const result: ActiveListing[] = [];
  for (const l of items) {
    const params = l.protocol_data?.parameters;
    const offer = params?.offer?.[0];
    const idStr = offer?.identifierOrCriteria;
    if (!idStr) continue;
    const tokenId = Number(idStr);
    if (!Number.isFinite(tokenId)) continue;
    const price = l.price?.current;
    if (!price?.value) continue;
    const priceEth = rawAmountToEth(price.value, price.decimals ?? 18);
    if (!Number.isFinite(priceEth) || priceEth <= 0) continue;
    const startSec = params?.startTime ? Number(params.startTime) : null;
    const endSec = params?.endTime ? Number(params.endTime) : null;
    result.push({
      tokenId,
      priceEth,
      priceSymbol: price.currency ?? "ETH",
      seller: params?.offerer ?? null,
      startTime: startSec ? new Date(startSec * 1000).toISOString() : null,
      expirationTime: endSec ? new Date(endSec * 1000).toISOString() : null,
    });
  }
  // Sort by price ascending (cheapest first - matches "floor" view).
  result.sort((a, b) => a.priceEth - b.priceEth);
  return result;
}

// ---------- Wallet inventory ----------

export type WalletWhale = {
  tokenId: number;
  name: string | null;
  imageUrl: string | null;
};

type RawAccountNfts = {
  nfts?: Array<{
    identifier?: string;
    name?: string;
    image_url?: string;
    contract?: string;
  }>;
  next?: string;
};

const REVALIDATE_WALLET = 120;

export async function getWalletWhales(address: string): Promise<WalletWhale[]> {
  const lower = address.toLowerCase();
  const data = await osFetch<RawAccountNfts>(
    `/chain/${CHAIN}/account/${lower}/nfts?collection=${COLLECTION_SLUG}&limit=200`,
    REVALIDATE_WALLET,
  );
  const items = data?.nfts ?? [];
  const result: WalletWhale[] = [];
  for (const n of items) {
    const id = Number(n.identifier);
    if (!Number.isFinite(id)) continue;
    result.push({
      tokenId: id,
      name: n.name ?? null,
      imageUrl: n.image_url ?? null,
    });
  }
  result.sort((a, b) => a.tokenId - b.tokenId);
  return result;
}

// ---------- Helpers ----------

export function shortAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatEth(value: number, maxFrac = 4): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFrac,
  });
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}
