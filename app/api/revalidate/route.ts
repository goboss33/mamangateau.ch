/* Webhook de Carnet : une page du Journal vient d'être publiée / modifiée /
   retirée → on rafraîchit le cache ISR immédiatement. Signé HOOK_SECRET. */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { JOURNAL_SEGMENT } from "@/lib/journal";

export async function POST(req: NextRequest) {
  const secret = process.env.CARNET_HOOK_SECRET;
  if (!secret || req.headers.get("x-hook-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let slugs: string[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.slugs)) slugs = body.slugs.filter((s: unknown) => typeof s === "string" && /^[a-z0-9-]+$/.test(s as string));
  } catch { /* corps vide toléré */ }

  revalidateTag("journal");
  revalidatePath(`/${JOURNAL_SEGMENT}`);
  for (const s of slugs.slice(0, 20)) {
    revalidateTag(`journal-${s}`);
    revalidatePath(`/${JOURNAL_SEGMENT}/${s}`);
  }
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true, slugs });
}
