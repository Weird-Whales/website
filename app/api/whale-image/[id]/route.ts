/**
 * Proxies whale images from the GitHub raw mirror with proper CORS headers
 * so the wallpaper canvas can pull them in without tainting. Cached at the
 * edge for a day; the underlying assets never change.
 */
const TOTAL_SUPPLY = 3350;
const UPSTREAM =
  "https://raw.githubusercontent.com/Weird-Whales/images/main/optimized-images/600x600";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 0 || n >= TOTAL_SUPPLY) {
    return new Response("Not found", { status: 404 });
  }
  const upstream = await fetch(`${UPSTREAM}/${n}.png`, {
    next: { revalidate: 86_400 },
  });
  if (!upstream.ok) {
    return new Response("Upstream error", { status: 502 });
  }
  const buf = await upstream.arrayBuffer();
  return new Response(buf, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
