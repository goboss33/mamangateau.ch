"use client";

import { useState } from "react";

const TYPES = [
  { value: "COMMERCE", label: "Café · Salon de thé" },
  { value: "COMMERCE", label: "Boulangerie · Épicerie fine" },
  { value: "PHOTOGRAPHE", label: "Photographe" },
  { value: "WEDDING_PLANNER", label: "Wedding planner · Événementiel" },
  { value: "SALLE", label: "Salle · Domaine · Traiteur" },
  { value: "AUTRE", label: "Autre" },
] as const;

const input =
  "w-full rounded-2xl border border-chocolate/15 bg-vanilla px-5 py-3.5 text-[15px] text-chocolate outline-none transition-colors placeholder:text-grey-studio/60 focus:border-gold";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-grey-studio";

export default function PartnerForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const f = new FormData(e.currentTarget);
    const typeIdx = Number(f.get("typeIdx") ?? 0);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/partenaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: String(f.get("business") ?? ""),
          type: TYPES[typeIdx]?.value ?? "AUTRE",
          typeLabel: TYPES[typeIdx]?.label ?? "",
          contactName: String(f.get("contactName") ?? ""),
          phone: String(f.get("phone") ?? ""),
          city: String(f.get("city") ?? ""),
          message: String(f.get("message") ?? ""),
          website: String(f.get("website") ?? ""),
        }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (!j.ok) throw new Error(j.error);
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error && err.message ? err.message : "Un souci technique est survenu — réessayez ou écrivez-nous sur WhatsApp.");
    }
  }

  if (state === "done") {
    return (
      <div data-reveal className="mx-auto max-w-xl rounded-3xl border border-gold/40 bg-vanilla px-8 py-12 text-center">
        <p className="script-accent text-3xl">merci !</p>
        <p className="mt-4 leading-relaxed text-cocoa">
          Votre candidature est bien arrivée dans l'atelier. Annie vous répond
          personnellement, en général sous 24 h — le plus souvent sur WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-xl gap-5" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div data-reveal>
        <label className={label} htmlFor="pf-business">Votre commerce / activité *</label>
        <input id="pf-business" name="business" required minLength={2} placeholder="Ex. Café des Alpes" className={input} />
      </div>
      <div data-reveal className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="pf-type">Vous êtes *</label>
          <select id="pf-type" name="typeIdx" className={input} defaultValue="0">
            {TYPES.map((t, i) => (
              <option key={t.label} value={i}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="pf-city">Ville</label>
          <input id="pf-city" name="city" placeholder="Ex. Lutry" className={input} />
        </div>
      </div>
      <div data-reveal className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="pf-name">Votre prénom *</label>
          <input id="pf-name" name="contactName" required minLength={2} placeholder="Ex. Marie" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="pf-phone">WhatsApp / mobile *</label>
          <input id="pf-phone" name="phone" required minLength={9} type="tel" placeholder="+41 79 …" className={input} />
        </div>
      </div>
      <div data-reveal>
        <label className={label} htmlFor="pf-msg">Un mot sur votre idée de partenariat <span className="normal-case text-grey-studio/70">(facultatif)</span></label>
        <textarea id="pf-msg" name="message" rows={4} maxLength={600} placeholder="Ex. Nos clients nous demandent souvent des gâteaux personnalisés…" className={input} />
      </div>
      {state === "error" && (
        <p className="rounded-2xl bg-blush/30 px-5 py-3 text-sm text-chocolate" role="alert">{error}</p>
      )}
      <div data-reveal className="text-center">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-chocolate px-10 py-4 text-[15px] font-semibold text-vanilla shadow-[0_18px_38px_-18px_rgba(74,44,32,0.55)] transition-transform duration-300 hover:scale-[1.04] disabled:opacity-60"
        >
          {state === "sending" ? "Envoi en cours…" : "Proposer un partenariat"}
        </button>
        <p className="mt-3 text-xs text-grey-studio">Réponse personnelle sous 24 h · aucun engagement</p>
      </div>
    </form>
  );
}
