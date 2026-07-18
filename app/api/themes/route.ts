/* Base des suggestions de thèmes du configurateur — lue par Carnet (vigie
   des thèmes) pour comparer aux thèmes réellement saisis par les clientes.
   Source de vérité unique : lib/data THEME_SUGGESTIONS. */
import { NextResponse } from "next/server";
import { THEME_SUGGESTIONS } from "@/lib/data";

export function GET() {
  return NextResponse.json(
    { themes: THEME_SUGGESTIONS },
    { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } }
  );
}
