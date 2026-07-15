/* Candidature partenaire → transmise au back-office (Carnet), best-effort mail sinon. */
import { NextRequest, NextResponse } from "next/server";

const TYPES = ["COMMERCE", "PHOTOGRAPHE", "WEDDING_PLANNER", "SALLE", "AUTRE"];

function parseBody(b: Record<string, unknown>) {
  const str = (k: string, max: number) => String(b[k] ?? "").trim().slice(0, max);
  const p = {
    business: str("business", 120),
    type: TYPES.includes(String(b.type)) ? String(b.type) : "AUTRE",
    typeLabel: str("typeLabel", 60),
    contactName: str("contactName", 80),
    phone: str("phone", 30),
    city: str("city", 60),
    message: str("message", 600),
    website: str("website", 200),
  };
  if (p.business.length < 2) return { error: "Nom du commerce requis." };
  if (p.contactName.length < 2) return { error: "Votre prénom est requis." };
  if (p.phone.replace(/\D/g, "").length < 9) return { error: "Numéro WhatsApp requis." };
  return { data: p };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  const parsed = parseBody(body as Record<string, unknown>);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const p = parsed.data;
  if (p.website) return NextResponse.json({ ok: true }); // bot piégé

  const hookBase = process.env.CARNET_HOOK_URL; // …/api/hooks/devis
  if (hookBase && process.env.CARNET_HOOK_SECRET) {
    try {
      const res = await fetch(hookBase.replace(/\/devis\/?$/, "/partner"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-carnet-secret": process.env.CARNET_HOOK_SECRET },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          business: p.business,
          type: p.type,
          typeLabel: p.typeLabel,
          contactName: p.contactName,
          phone: p.phone,
          city: p.city,
          message: p.message,
        }),
      });
      if (!res.ok) throw new Error(`hook ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("partner hook error:", e);
    }
  }
  return NextResponse.json({ ok: false, error: "Un souci technique est survenu — écrivez-nous directement sur WhatsApp !" }, { status: 502 });
}
