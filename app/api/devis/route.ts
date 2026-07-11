import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/data";

/* ---------------------------------------------------------------------------
   POST /api/devis — reçoit la demande du configurateur et l'envoie par
   e-mail via Brevo : (1) devis complet à Annie (reply-to = client, photos en
   pièces jointes), (2) accusé de réception au client.
   Env requis : BREVO_API_KEY, DEVIS_FROM_EMAIL (sender vérifié Brevo).
   Optionnels : DEVIS_TO (défaut mamangateau.ch@gmail.com), DEVIS_FROM_NAME.
--------------------------------------------------------------------------- */

type Photo = { name: string; data: string }; // data = base64 (sans préfixe)

type Payload = {
  occasion: string;
  eventDate?: string;
  celebrant?: string;
  age?: string;
  tiers: number;
  parts: number;
  biscuit: string;
  fourrages: string[];
  glutenFree: boolean;
  style: string;
  themeNote?: string;
  delivery: { mode: string; address?: string; km?: number; fee?: number | null };
  estimate: { from: number; to: number };
  contact: { firstName: string; lastName: string; phone: string; email: string };
  photos?: Photo[];
  website?: string; // honeypot
};

/* Rate-limit simple en mémoire : 5 requêtes / 10 min / IP */
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function brevoSend(key: string, mail: object) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": key },
    body: JSON.stringify(mail),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`brevo ${res.status}: ${await res.text()}`);
}

export async function POST(req: NextRequest) {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "E-mail non configuré (BREVO_API_KEY manquant)." },
      { status: 500 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Trop de demandes, réessayez plus tard." }, { status: 429 });
  }

  let p: Payload;
  try {
    p = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  /* Honeypot : un humain ne remplit jamais ce champ */
  if (p.website) return NextResponse.json({ ok: true });

  const { contact } = p;
  if (
    !contact?.firstName?.trim() ||
    !contact?.lastName?.trim() ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact?.email ?? "") ||
    (contact?.phone ?? "").replace(/\D/g, "").length < 9 ||
    !p.occasion ||
    !p.biscuit ||
    !p.fourrages?.length
  ) {
    return NextResponse.json({ ok: false, error: "Informations incomplètes." }, { status: 400 });
  }

  const to = process.env.DEVIS_TO ?? SITE.email;
  const fromEmail = process.env.DEVIS_FROM_EMAIL ?? SITE.email;
  const fromName = process.env.DEVIS_FROM_NAME ?? "Maman Gâteau — Site";

  const photos = (p.photos ?? []).slice(0, 3);
  const attachments = photos
    .filter((f) => f.data && f.data.length < 2_800_000) // ~2 Mo base64 chacune
    .map((f, i) => ({ name: f.name || `inspiration-${i + 1}.jpg`, content: f.data }));

  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#9a9a9a;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#4a2c20;font-weight:600">${esc(v)}</td></tr>`;

  const deliveryTxt =
    p.delivery.mode === "livraison"
      ? `Livraison — ${p.delivery.address ?? "?"}${
          typeof p.delivery.km === "number"
            ? ` (${p.delivery.km} km, ${p.delivery.fee ? `${p.delivery.fee} CHF` : "offerte"})`
            : " (distance à confirmer)"
        }`
      : "Retrait à l'atelier (Pully)";

  const recap = `
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:15px">
      ${row("Occasion", p.occasion)}
      ${p.eventDate ? row("Date", p.eventDate) : ""}
      ${p.celebrant ? row("Pour", p.celebrant + (p.age ? ` (${p.age} ans)` : "")) : ""}
      ${row("Format", `${p.tiers} étage${p.tiers > 1 ? "s" : ""} · ${p.parts} parts`)}
      ${row("Biscuit", p.biscuit)}
      ${row("Fourrage", p.fourrages.join(" + ") + (p.glutenFree ? " · SANS GLUTEN" : ""))}
      ${row("Style", p.style + (p.themeNote ? ` — « ${p.themeNote} »` : ""))}
      ${row("Remise", deliveryTxt)}
      ${row("Estimation", `CHF ${p.estimate.from}–${p.estimate.to}`)}
      ${row("Client", `${contact.firstName} ${contact.lastName}`)}
      ${row("Mobile", contact.phone)}
      ${row("E-mail", contact.email)}
    </table>`;

  try {
    /* 1 — le devis pour Annie */
    await brevoSend(key, {
      sender: { name: fromName, email: fromEmail },
      to: [{ email: to, name: "Annie" }],
      replyTo: { email: contact.email, name: `${contact.firstName} ${contact.lastName}` },
      subject: `🎂 Devis — ${p.occasion} · ${p.parts} parts · ${contact.firstName} ${contact.lastName}`,
      htmlContent: `<div style="font-family:sans-serif;color:#4a2c20"><h2 style="margin:0 0 4px">Nouvelle demande de devis</h2><p style="margin:0 0 18px;color:#9a9a9a">envoyée depuis mamangateau.ch</p>${recap}<p style="margin-top:18px;color:#9a9a9a;font-size:13px">Répondre à ce mail écrit directement à ${esc(contact.firstName)} (${esc(contact.email)}) · mobile : ${esc(contact.phone)}</p></div>`,
      ...(attachments.length ? { attachment: attachments } : {}),
    });

    /* 2 — l'accusé de réception pour le client */
    await brevoSend(key, {
      sender: { name: "Maman Gâteau", email: fromEmail },
      to: [{ email: contact.email, name: `${contact.firstName} ${contact.lastName}` }],
      subject: "Votre demande de gâteau est bien arrivée 🎂",
      htmlContent: `<div style="font-family:sans-serif;color:#4a2c20;max-width:560px"><h2 style="margin:0 0 12px">Merci ${esc(contact.firstName)} !</h2><p>Votre demande est arrivée dans l'atelier. Je la regarde personnellement et je vous réponds <strong>sous 24 h</strong> pour affiner les détails et confirmer le devis.</p>${recap}<p style="margin-top:18px">À très vite,<br/><strong>Annie</strong> — Maman Gâteau · Pully<br/><span style="color:#9a9a9a;font-size:13px">Créatrice de souvenirs · ${esc(SITE.domain)}</span></p></div>`,
    });
  } catch (e) {
    console.error("devis mail error:", e);
    return NextResponse.json(
      { ok: false, error: "L'envoi a échoué — réessayez ou écrivez-nous directement." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
