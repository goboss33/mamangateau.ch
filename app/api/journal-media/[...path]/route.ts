/* Proxy des médias du Journal : le navigateur ne parle qu'au domaine du
   site (cache Cloudflare, Carnet jamais exposé), le serveur relaie vers
   l'API publique de Carnet — qui ne sert que les médias publiés. */
import { NextRequest, NextResponse } from "next/server";

function carnetBase(): string | null {
  const hook = process.env.CARNET_HOOK_URL;
  if (!hook) return null;
  try { return new URL(hook).origin; } catch { return null; }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const rel = path.join("/");
  const base = carnetBase();
  if (!base || rel.includes("..")) return new NextResponse("introuvable", { status: 404 });
  try {
    const res = await fetch(`${base}/api/public/journal-media/${rel}`, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return new NextResponse("introuvable", { status: 404 });
    return new NextResponse(res.body, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("indisponible", { status: 503 });
  }
}
