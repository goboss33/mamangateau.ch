/* Proxy des médias du Journal : le navigateur ne parle qu'au domaine du
   site (cache Cloudflare, Carnet jamais exposé), le serveur relaie vers
   l'API publique de Carnet — qui ne sert que les médias publiés. */
import { NextRequest, NextResponse } from "next/server";

function carnetBase(): string | null {
  const hook = process.env.CARNET_HOOK_URL;
  if (!hook) return null;
  try { return new URL(hook).origin; } catch { return null; }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const rel = path.join("/");
  const base = carnetBase();
  if (!base || rel.includes("..")) return new NextResponse("introuvable", { status: 404 });
  try {
    const range = req.headers.get("range");
    const res = await fetch(`${base}/api/public/journal-media/${rel}`, {
      signal: AbortSignal.timeout(30_000),
      headers: range ? { Range: range } : undefined,
    });
    if (!res.ok && res.status !== 206) return new NextResponse("introuvable", { status: res.status === 416 ? 416 : 404 });
    const headers = new Headers({
      "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    });
    for (const h of ["Accept-Ranges", "Content-Range", "Content-Length"]) {
      const v = res.headers.get(h);
      if (v) headers.set(h, v);
    }
    return new NextResponse(res.body, { status: res.status, headers });
  } catch {
    return new NextResponse("indisponible", { status: 503 });
  }
}
