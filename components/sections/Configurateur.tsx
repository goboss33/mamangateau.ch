"use client";

/* ---------------------------------------------------------------------------
   Configurateur v2 — « L'atelier », l'outil de conversion n°1
   Sept gestes en carousel horizontal : occasion (+date, +fêté·e), taille
   (étages/parts), goûts (biscuit + 1-2 fourrages, suppléments affichés),
   style (+ thème libre + photos d'inspiration), remise (retrait ou livraison
   avec distance calculée), coordonnées, récap. Un aperçu du gâteau se
   construit en direct. Le devis part par e-mail (API /api/devis) sans
   quitter le site, avec accusé de réception au client.
--------------------------------------------------------------------------- */

import { useEffect, useMemo, useRef, useState } from "react";
import CakePreview from "@/components/CakePreview";
import {
  EXTRAS,
  OCCASIONS,
  STYLES,
  BISCUITS,
  FOURRAGES,
  MAX_FOURRAGES,
  TIER2,
  DELIVERY,
  cakeBase,
  estimateTotal,
} from "@/lib/data";

type Chip = { id: string; label: string; emoji?: string; desc?: string; sup?: number };

const STEPS = ["Occasion", "Taille", "Goûts", "Style", "Remise", "Contact"] as const;

function ChipGrid({
  options,
  selected,
  onToggle,
  name,
  multi = false,
  cols = false,
}: {
  options: readonly Chip[];
  selected: string[];
  onToggle: (id: string) => void;
  name: string;
  multi?: boolean;
  cols?: boolean;
}) {
  return (
    <div
      className={cols ? "grid grid-cols-2 gap-2.5" : "flex flex-wrap gap-2.5"}
      role={multi ? "group" : "radiogroup"}
      aria-label={name}
    >
      {options.map((o) => {
        const active = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={active}
            onClick={() => onToggle(o.id)}
            className={`rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
              active
                ? "border-chocolate bg-chocolate text-vanilla shadow-[0_12px_28px_-14px_rgba(74,44,32,0.6)]"
                : "border-chocolate/15 bg-vanilla text-chocolate hover:border-gold/60 hover:bg-cream/60"
            }`}
          >
            <span className="flex items-center gap-2 text-[15px] font-semibold">
              {o.emoji && <span aria-hidden>{o.emoji}</span>}
              {o.label}
              {typeof o.sup === "number" && o.sup > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    active ? "bg-vanilla/20 text-vanilla" : "bg-blush/50 text-chocolate"
                  }`}
                >
                  +{o.sup}
                </span>
              )}
            </span>
            {o.desc && (
              <span className={`mt-0.5 block text-xs ${active ? "text-vanilla/70" : "text-grey-studio"}`}>
                {o.desc}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-chocolate/15 bg-vanilla px-4 py-3 text-[15px] text-chocolate placeholder:text-grey-studio/70 outline-none transition-colors focus:border-gold";

/** Durée de mémorisation du rattachement partenaire (?ref=CODE), en jours — réglable via env. */
const REF_COOKIE_DAYS = Number(process.env.NEXT_PUBLIC_REF_COOKIE_DAYS ?? 90) || 90;

export default function Configurateur() {
  /* ------------------------------------------------------------- état */
  const [occasion, setOccasion] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [celebrant, setCelebrant] = useState("");
  const [age, setAge] = useState("");
  const [tiers, setTiers] = useState<1 | 2>(1);
  const [parts, setParts] = useState(20);
  const [biscuit, setBiscuit] = useState<string | null>(null);
  const [fourrages, setFourrages] = useState<string[]>([]);
  const [lactoseFree, setLactoseFree] = useState(false);
  const [extras, setExtras] = useState<Record<string, number>>({});
  const [style, setStyle] = useState<string | null>(null);
  const [themeNote, setThemeNote] = useState("");
  const [photos, setPhotos] = useState<{ name: string; dataUrl: string }[]>([]);
  const [deliveryMode, setDeliveryMode] = useState<"retrait" | "livraison">("retrait");
  const [address, setAddress] = useState("");
  const [dist, setDist] = useState<{ status: "idle" | "loading" | "ok" | "fallback"; km?: number; fee?: number }>({ status: "idle" });
  const [contact, setContact] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [partnerCode, setPartnerCode] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const [step, setStep] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const isBirthday = occasion === "anniversaire-enfant" || occasion === "anniversaire-adulte";

  const minParts = tiers === 2 ? TIER2.minParts : 12;
  const maxParts = tiers === 2 ? TIER2.maxParts : 30;
  const deliveryFee =
    deliveryMode === "retrait" ? 0 : dist.status === "ok" ? (dist.fee ?? 0) : null;
  const estimate = useMemo(
    () => estimateTotal({ parts, tiers, fourrages, deliveryFee, occasion, extras }),
    [parts, tiers, fourrages, deliveryFee, occasion, extras]
  );

  const labelOf = (list: readonly Chip[], id: string | null) =>
    list.find((o) => o.id === id)?.label ?? "—";

  /* --------------------------------------------------------- carousel */
  /* 7 slides sur mobile (récap inclus), 6 sur desktop (ticket épinglé) */
  const maxIndex = () =>
    typeof window !== "undefined" && window.innerWidth < 1024 ? 6 : 5;

  const goTo = (i: number) => {
    setStep(Math.max(0, Math.min(i, maxIndex())));
    /* revenir en haut de l'étape si on avait défilé plus bas */
    requestAnimationFrame(() => {
      const el = document.getElementById("configurateur");
      if (el && el.getBoundingClientRect().top < -12) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  /* Barre sticky mobile : visible seulement quand le configurateur est à l'écran ;
     masque aussi la bulle de contact (classe globale, CSS mobile). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        document.documentElement.classList.toggle("mg-in-config", e.isIntersecting);
      },
      { rootMargin: "-140px 0px -100px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("mg-in-config");
    };
  }, [sent]);

  /* Pré-remplissage depuis les pages ciblées : /?occasion=mariage#configurateur
     + rattachement partenaire : /?ref=CODE (QR/flyers), mémorisé 90 jours */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const o = params.get("occasion");
    if (o && OCCASIONS.some((x) => x.id === o)) setOccasion(o);
    try {
      const ref = params.get("ref");
      if (ref) {
        localStorage.setItem("mg_ref", JSON.stringify({ code: ref.toUpperCase(), ts: Date.now() }));
        setPartnerCode(ref.toUpperCase());
      } else {
        const saved = JSON.parse(localStorage.getItem("mg_ref") ?? "null");
        if (saved?.code && Date.now() - (saved.ts ?? 0) < REF_COOKIE_DAYS * 86400000) setPartnerCode(saved.code);
      }
    } catch {}
    /* Arrivée directe avec ancre : re-caler une fois le layout stabilisé
       (le hero qui se charge décale l'atterrissage natif du navigateur). */
    if (window.location.hash === "#configurateur") {
      window.setTimeout(() => {
        document.getElementById("configurateur")?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
      }, 750);
    }
  }, []);

  const advance = (from: number) => window.setTimeout(() => goTo(from + 1), 150);

  const maybeCelebrate = () => {
    if (!celebrated && occasion && biscuit && fourrages.length && style) {
      setCelebrated(true);
      window.dispatchEvent(new CustomEvent("mg:burst"));
    }
  };
  useEffect(maybeCelebrate, [occasion, biscuit, fourrages, style]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------------------------------------ photos */
  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const remaining = 3 - photos.length;
    const list = Array.from(files).slice(0, remaining);
    for (const file of list) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const max = 1200;
          const ratio = Math.min(1, max / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * ratio);
          canvas.height = Math.round(img.height * ratio);
          canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        };
        img.onerror = reject;
        img.src = url;
      }).catch(() => "");
      if (dataUrl) setPhotos((p) => [...p, { name: file.name.replace(/\.[^.]+$/, ".jpg"), dataUrl }].slice(0, 3));
    }
  };

  /* ---------------------------------------------------------- distance */
  const distReqId = useRef(0);
  const computeDistance = async (addr?: string) => {
    const target = (addr ?? address).trim();
    if (target.length < 8) return;
    const id = ++distReqId.current;
    setDist({ status: "loading" });
    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: target }),
      });
      const data = await res.json();
      if (id !== distReqId.current) return; // réponse obsolète
      if (data.ok) setDist({ status: "ok", km: data.km, fee: data.fee });
      else setDist({ status: "fallback" });
    } catch {
      if (id === distReqId.current) setDist({ status: "fallback" });
    }
  };

  /* Calcul automatique pendant la frappe (800 ms après la dernière touche) */
  useEffect(() => {
    if (deliveryMode !== "livraison" || address.trim().length < 8) return;
    const t = window.setTimeout(() => computeDistance(), 800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, deliveryMode]);

  /* ---------------------------------------------- autocomplétion adresse */
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSug, setShowSug] = useState(false);
  const skipSugRef = useRef(false);

  useEffect(() => {
    if (deliveryMode !== "livraison") return;
    if (skipSugRef.current) {
      skipSugRef.current = false;
      return;
    }
    const q = address.trim();
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: q }),
        });
        const data = await res.json();
        setSuggestions(data.ok ? (data.suggestions ?? []) : []);
        setShowSug(true);
      } catch {
        setSuggestions([]);
      }
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, deliveryMode]);

  const pickSuggestion = (s: string) => {
    skipSugRef.current = true;
    setAddress(s);
    setSuggestions([]);
    setShowSug(false);
    computeDistance(s);
  };

  /* ------------------------------------------------------------- envoi */
  const validate = (): { ok: boolean; msg?: string; step?: number } => {
    if (!occasion) return { ok: false, msg: "Choisissez l'occasion.", step: 0 };
    if (!biscuit) return { ok: false, msg: "Choisissez le biscuit.", step: 2 };
    if (!fourrages.length) return { ok: false, msg: "Choisissez au moins un fourrage.", step: 2 };
    if (!style) return { ok: false, msg: "Choisissez un style.", step: 3 };
    if (deliveryMode === "livraison" && address.trim().length < 5)
      return { ok: false, msg: "Indiquez l'adresse de livraison.", step: 4 };
    if (!contact.firstName.trim() || !contact.lastName.trim())
      return { ok: false, msg: "Indiquez votre prénom et votre nom.", step: 5 };
    if (contact.phone.replace(/\D/g, "").length < 9)
      return { ok: false, msg: "Indiquez un numéro de mobile valide.", step: 5 };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email))
      return { ok: false, msg: "Indiquez un e-mail valide.", step: 5 };
    return { ok: true };
  };

  const submit = async () => {
    const v = validate();
    if (!v.ok) {
      setError(v.msg ?? "Informations manquantes.");
      if (typeof v.step === "number") goTo(v.step);
      return;
    }
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion: labelOf(OCCASIONS, occasion),
          eventDate,
          celebrant: celebrant.trim(),
          age: isBirthday ? age.trim() : "",
          tiers,
          parts,
          biscuit: labelOf(BISCUITS, biscuit),
          fourrages: fourrages.map((f) => labelOf(FOURRAGES, f)),
          lactoseFree,
          extras: EXTRAS.filter((x) => (extras[x.id] ?? 0) > 0).map((x) => ({
            label: x.label,
            qty: extras[x.id],
            price: x.price,
          })),
          style: labelOf(STYLES, style),
          themeNote: style === "theme" ? themeNote.trim() : "",
          delivery:
            deliveryMode === "retrait"
              ? { mode: "retrait" }
              : { mode: "livraison", address: address.trim(), km: dist.km, fee: deliveryFee },
          estimate: { price: estimate.price },
          contact,
          partnerCode: partnerCode.trim().toUpperCase(),
          photos: photos.map((p) => ({ name: p.name, data: p.dataUrl.split(",")[1] ?? "" })),
          website: "", // honeypot
        }),
      });
      const raw = await res.text();
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(
          res.status === 413
            ? "Les photos sont trop volumineuses — retirez-en une et réessayez."
            : `Le serveur n'a pas répondu correctement (${res.status}). Réessayez ou écrivez-nous sur WhatsApp.`
        );
      }
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Erreur d'envoi");
      setSent(true);
      window.dispatchEvent(new CustomEvent("mg:burst"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "L'envoi a échoué — réessayez.");
    } finally {
      setSending(false);
    }
  };

  /* ------------------------------------------------------------ ticket */
  const base = cakeBase(parts, tiers, occasion);
  const ticket = (
    <>
      <div className="ticket relative px-7 pb-2 pt-7">
        <p className="script-accent text-3xl">Votre gâteau</p>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-grey-studio">Récapitulatif</p>

        <dl className="mt-5 space-y-3 text-[14px]">
          {[
            ["Occasion", labelOf(OCCASIONS, occasion) + (eventDate ? ` · ${eventDate}` : "")],
            ...(celebrant || (isBirthday && age)
              ? [["Pour", `${celebrant || "—"}${isBirthday && age ? ` (${age} ans)` : ""}`]]
              : []),
            ["Format", `${tiers} étage${tiers > 1 ? "s" : ""} · ${parts} parts`],
            ["Biscuit", labelOf(BISCUITS, biscuit)],
            [
              "Fourrage",
              fourrages.length
                ? fourrages.map((f) => labelOf(FOURRAGES, f)).join(" + ") + (lactoseFree ? " · sans lactose" : "")
                : "—",
            ],
            ["Style", labelOf(STYLES, style)],
            [
              "Remise",
              deliveryMode === "retrait"
                ? "Retrait à l'atelier"
                : (dist.status === "ok" ? `Livraison · ${dist.km} km` : "Livraison") +
                  (occasion === "mariage" ? " · installation offerte" : ""),
            ],
          ].map(([k, v]) => (
            <div key={k as string} className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 font-semibold text-grey-studio">{k}</dt>
              <dd className="text-right font-semibold text-chocolate">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="dashed-sep mt-5 space-y-1.5 pt-4 text-[13px]">
          <div className="flex justify-between text-cocoa">
            <span>Gâteau</span>
            <span>CHF {base}</span>
          </div>
          {estimate.sup > 0 && (
            <div className="flex justify-between text-cocoa">
              <span>Suppléments fourrage</span>
              <span>+ CHF {estimate.sup}</span>
            </div>
          )}
          {EXTRAS.filter((x) => (extras[x.id] ?? 0) > 0).map((x) => (
            <div key={x.id} className="flex justify-between text-cocoa">
              <span>
                {x.label}
                {(extras[x.id] ?? 0) > 1 ? ` × ${extras[x.id]}` : ""}
              </span>
              <span>+ CHF {x.price * (extras[x.id] ?? 0)}</span>
            </div>
          ))}
          <div className="flex justify-between text-cocoa">
            <span>Livraison</span>
            <span>
              {deliveryMode === "retrait"
                ? "—"
                : deliveryFee === null
                  ? "confirmée par Annie"
                  : deliveryFee === 0
                    ? "offerte 💛"
                    : `+ CHF ${deliveryFee}`}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <span className="font-semibold text-grey-studio">Estimation</span>
            <span className="font-display text-[26px] text-chocolate">
              CHF {estimate.price}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-grey-studio">
            Prix pour une belle création, tout compris. Annie confirme votre devis — le plus
            souvent identique, ajusté seulement pour un décor exceptionnel.
          </p>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={sending}
          className="btn-primary mt-5 w-full justify-center max-lg:hidden disabled:opacity-60"
        >
          {sending ? "Envoi en cours…" : "Demander mon devis"}
        </button>
        {error && <p className="pt-2 text-center text-xs font-semibold text-strawberry">{error}</p>}
        <p className="pb-4 pt-2.5 text-center text-[11px] text-grey-studio">
          Gratuit et sans engagement — réponse d'Annie sous 24 h.
        </p>
      </div>
      <div className="ticket-edge" aria-hidden />
    </>
  );

  /* ------------------------------------------------------------ succès */
  if (sent) {
    return (
      <section id="atelier-devis" ref={sectionRef} className="relative overflow-hidden bg-vanilla py-24 max-lg:pb-28 md:py-32">
        <div id="configurateur" className="mx-auto max-w-xl px-6 text-center">
          <div className="ticket relative px-8 pb-10 pt-12">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint/40">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4A2C20" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m4.5 12.5 5 5 10-11" />
              </svg>
            </span>
            <p className="script-accent mt-6 text-[clamp(2.4rem,8vw,3.4rem)] leading-tight">
              Merci {contact.firstName} !
            </p>
            <p className="mt-4 leading-relaxed text-cocoa">
              Votre demande est arrivée dans l'atelier. Annie la regarde personnellement et
              vous répond <strong>sous 24 h</strong> — un e-mail de confirmation vient de
              partir sur <span className="font-semibold">{contact.email}</span>.
            </p>
            <p className="mt-6 text-sm text-grey-studio">
              En attendant, la suite des créations vous attend sur Instagram ✨
            </p>
          </div>
          <div className="ticket-edge mx-auto" aria-hidden />
        </div>
      </section>
    );
  }

  /* -------------------------------------------------------------- rendu */
  return (
    <section id="atelier-devis" ref={sectionRef} className="relative overflow-hidden bg-vanilla py-24 max-lg:pb-28 md:py-32">
      <div
        className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(246,201,212,0.5) 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div id="configurateur" className="scroll-mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <div data-reveal className="min-w-0">
            <div className="mb-10 max-w-2xl max-lg:hidden md:mb-14">
              <p data-reveal className="eyebrow mb-4">L'atelier</p>
              <h2 data-reveal className="section-title">
                Composez votre gâteau
                <span className="script-accent block pt-2 text-[clamp(2.4rem,6vw,4.4rem)]">
                  en quelques gestes
                </span>
              </h2>
              <p data-reveal className="mt-6 leading-relaxed text-cocoa">
                Un geste après l'autre, votre gâteau prend forme sous vos yeux — et le devis
                arrive directement chez Annie.
              </p>
            </div>

            {/* En-tête compact (mobile) : titre discret + progression nommée */}
            <div className="mb-5 flex items-center gap-3 lg:hidden">
              <div className="w-16 shrink-0">
                <CakePreview tiers={tiers} styleId={style} isBirthday={isBirthday} celebrant={celebrant} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  Composer mon gâteau
                </p>
                <p className="font-display truncate text-lg leading-tight text-chocolate">
                  Étape {Math.min(step + 1, 7)}/7 · {step === 6 ? "Récapitulatif" : STEPS[Math.min(step, 5)]}
                </p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-chocolate/10">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500 ease-out"
                    style={{ width: `${((Math.min(step, 6) + 1) / 7) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Progression (desktop) */}
            <div className="mb-6 max-lg:hidden">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {STEPS.map((s, i) => {
                  const active = Math.min(step, 5) === i;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => goTo(i)}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                        active
                          ? "border-chocolate bg-chocolate text-vanilla"
                          : "border-chocolate/15 text-chocolate/60 hover:border-gold/50"
                      }`}
                    >
                      <span className="font-display" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                      <span className="max-xl:hidden">{s}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 h-px w-full bg-gold/15">
                <div
                  className="h-full bg-gold transition-all duration-500 ease-out"
                  style={{ width: `${(Math.min(step, 5) / 5) * 100 || 3}%` }}
                />
              </div>
            </div>

            {/* Étape courante */}
            <div className="relative">
              {/* 01 — Occasion */}
              {step === 0 && (
              <div className="mg-step-in" aria-label="Étape 1 : l'occasion">
                <ChipGrid
                  name="Occasion"
                  options={OCCASIONS}
                  selected={occasion ? [occasion] : []}
                  onToggle={(id) => {
                    setOccasion(id);
                    if (!(id === "anniversaire-enfant" || id === "anniversaire-adulte")) setAge("");
                  }}
                />
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-grey-studio">
                      Date de l'événement
                    </span>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={inputCls}
                    />
                  </label>
                  {occasion && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-grey-studio">
                        {isBirthday ? "Prénom de la star" : "À quel nom ? (optionnel)"}
                      </span>
                      <input
                        type="text"
                        value={celebrant}
                        onChange={(e) => setCelebrant(e.target.value)}
                        placeholder={isBirthday ? "Léa" : "Famille Dupont"}
                        className={inputCls}
                      />
                    </label>
                  )}
                  {isBirthday && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-grey-studio">
                        Son âge
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="7"
                        className={inputCls}
                      />
                    </label>
                  )}
                </div>
                <button type="button" onClick={() => goTo(1)} className="btn-primary mt-6 w-full justify-center max-lg:hidden sm:w-auto">
                  Continuer →
                </button>
              </div>
              )}

              {/* 02 — Taille */}
              {step === 1 && (
              <div className="mg-step-in" aria-label="Étape 2 : la taille">
                <div className="mb-5 flex gap-3">
                  {[1, 2].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTiers(t as 1 | 2);
                        if (t === 2 && parts < TIER2.minParts) setParts(TIER2.minParts);
                        if (t === 1 && parts > 30) setParts(30);
                        if (t === 1 && parts < 12) setParts(12);
                      }}
                      className={`flex-1 rounded-2xl border px-4 py-4 text-center transition-all duration-300 ${
                        tiers === t
                          ? "border-chocolate bg-chocolate text-vanilla shadow-[0_12px_28px_-14px_rgba(74,44,32,0.6)]"
                          : "border-chocolate/15 bg-vanilla text-chocolate hover:border-gold/60"
                      }`}
                    >
                      <span className="font-display text-2xl">{t}</span>
                      <span className="block text-xs font-semibold opacity-80">
                        étage{t > 1 ? "s" : ""}
                      </span>
                      {t === 2 && (
                        <span className={`mt-1 block text-[11px] ${tiers === 2 ? "text-vanilla/70" : "text-grey-studio"}`}>
                          dès {TIER2.minParts} parts
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-chocolate/10 bg-cream/50 p-6">
                  <div className="mb-5 flex items-baseline justify-between">
                    <span className="font-display text-4xl text-chocolate">
                      {parts}
                      {parts >= maxParts && "+"}
                    </span>
                    <span className="text-sm font-semibold text-cocoa">parts</span>
                  </div>
                  <input
                    type="range"
                    min={minParts}
                    max={maxParts}
                    value={parts}
                    onChange={(e) => setParts(parseInt(e.target.value, 10))}
                    className="mg-range"
                    style={{ "--fill": `${((parts - minParts) / (maxParts - minParts)) * 100}%` } as React.CSSProperties}
                    aria-label="Nombre de parts"
                  />
                  <div className="mt-2 flex justify-between text-xs text-grey-studio">
                    <span>{minParts}</span>
                    <span>{maxParts}+</span>
                  </div>
                  {tiers === 2 && (
                    <p className="mt-3 text-xs text-cocoa">
                      💡 Un gâteau à deux étages commence à {TIER2.minParts} parts.
                    </p>
                  )}
                </div>
                <button type="button" onClick={() => goTo(2)} className="btn-primary mt-6 w-full justify-center max-lg:hidden sm:w-auto">
                  Continuer →
                </button>
              </div>
              )}

              {/* 03 — Goûts */}
              {step === 2 && (
              <div className="mg-step-in" aria-label="Étape 3 : les goûts">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-grey-studio">
                  Le biscuit (1 choix)
                </p>
                <ChipGrid
                  name="Biscuit"
                  options={BISCUITS}
                  selected={biscuit ? [biscuit] : []}
                  onToggle={(id) => setBiscuit(id)}
                />
                <p className="mb-2.5 mt-6 text-xs font-semibold uppercase tracking-wider text-grey-studio">
                  Le fourrage (1 à {MAX_FOURRAGES} choix)
                </p>
                <ChipGrid
                  name="Fourrage"
                  multi
                  options={FOURRAGES}
                  selected={fourrages}
                  onToggle={(id) =>
                    setFourrages((cur) =>
                      cur.includes(id)
                        ? cur.filter((f) => f !== id)
                        : cur.length >= MAX_FOURRAGES
                          ? [...cur.slice(1), id]
                          : [...cur, id]
                    )
                  }
                />
                <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 text-sm text-cocoa">
                  <input
                    type="checkbox"
                    checked={lactoseFree}
                    onChange={(e) => setLactoseFree(e.target.checked)}
                    className="h-4 w-4 accent-gold"
                  />
                  Version sans lactose (sur demande)
                </label>

                <p className="mb-2.5 mt-7 text-xs font-semibold uppercase tracking-wider text-grey-studio">
                  Envie d'un peu plus ? (optionnel)
                </p>
                <div className="space-y-2.5">
                  {EXTRAS.map((x) => {
                    const qty = extras[x.id] ?? 0;
                    return (
                      <div
                        key={x.id}
                        className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                          qty > 0
                            ? "border-chocolate bg-chocolate text-vanilla shadow-[0_12px_28px_-14px_rgba(74,44,32,0.6)]"
                            : "border-chocolate/15 bg-vanilla text-chocolate"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold">
                            {x.label}
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                                qty > 0 ? "bg-vanilla/20 text-vanilla" : "bg-blush/50 text-chocolate"
                              }`}
                            >
                              CHF {x.price}
                            </span>
                          </p>
                          <p className={`mt-0.5 text-xs ${qty > 0 ? "text-vanilla/70" : "text-grey-studio"}`}>
                            {x.hint}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Retirer une ${x.label}`}
                            disabled={qty === 0}
                            onClick={() => setExtras((e) => ({ ...e, [x.id]: Math.max(0, qty - 1) }))}
                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-lg leading-none transition-opacity disabled:opacity-30 ${
                              qty > 0 ? "border-vanilla/40" : "border-chocolate/25"
                            }`}
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-[15px] font-bold tabular-nums">{qty}</span>
                          <button
                            type="button"
                            aria-label={`Ajouter une ${x.label}`}
                            disabled={qty >= 9}
                            onClick={() => setExtras((e) => ({ ...e, [x.id]: Math.min(9, qty + 1) }))}
                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-lg leading-none transition-opacity disabled:opacity-30 ${
                              qty > 0 ? "border-vanilla/40" : "border-chocolate/25"
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button type="button" onClick={() => goTo(3)} className="btn-primary mt-6 w-full justify-center max-lg:hidden sm:w-auto">
                  Continuer →
                </button>
              </div>
              )}

              {/* 04 — Style */}
              {step === 3 && (
              <div className="mg-step-in" aria-label="Étape 4 : le style">
                <ChipGrid
                  name="Style"
                  cols
                  options={STYLES}
                  selected={style ? [style] : []}
                  onToggle={(id) => setStyle(id)}
                />
                {style === "theme" && (
                  <textarea
                    value={themeNote}
                    onChange={(e) => setThemeNote(e.target.value)}
                    placeholder="Racontez votre idée : thème, couleurs, personnages…"
                    rows={3}
                    maxLength={500}
                    className={`${inputCls} mt-4 resize-none`}
                  />
                )}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-grey-studio">
                    Photos d'inspiration (optionnel, max 3)
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {photos.map((p, i) => (
                      <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl border border-gold/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.dataUrl} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos((cur) => cur.filter((_, j) => j !== i))}
                          aria-label="Retirer la photo"
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-chocolate/80 text-[10px] text-vanilla"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {photos.length < 3 && (
                      <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gold/50 text-gold transition-colors hover:bg-cream/60">
                        <span className="text-xl leading-none" aria-hidden>+</span>
                        <span className="text-[10px] font-semibold">Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            addPhotos(e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <button type="button" onClick={() => goTo(4)} className="btn-primary mt-6 w-full justify-center max-lg:hidden sm:w-auto">
                  Continuer →
                </button>
              </div>
              )}

              {/* 05 — Remise */}
              {step === 4 && (
              <div className="mg-step-in" aria-label="Étape 5 : la remise">
                <div className="mb-5 flex gap-3">
                  {(
                    [
                      ["retrait", "Retrait à l'atelier", "Pully — gratuit"],
                      ["livraison", "Livraison", `offerte ≤ ${DELIVERY.freeKm} km, puis ${DELIVERY.chfPerKm} CHF/km`],
                    ] as const
                  ).map(([mode, label, desc]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setDeliveryMode(mode)}
                      className={`flex-1 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                        deliveryMode === mode
                          ? "border-chocolate bg-chocolate text-vanilla shadow-[0_12px_28px_-14px_rgba(74,44,32,0.6)]"
                          : "border-chocolate/15 bg-vanilla text-chocolate hover:border-gold/60"
                      }`}
                    >
                      <span className="block text-[15px] font-semibold">{label}</span>
                      <span className={`mt-0.5 block text-xs ${deliveryMode === mode ? "text-vanilla/70" : "text-grey-studio"}`}>
                        {desc}
                      </span>
                    </button>
                  ))}
                </div>
                {occasion === "mariage" && deliveryMode === "livraison" && (
                  <p className="-mt-1 mb-4 text-sm font-semibold text-gold">
                    Mariage : l'installation sur place est offerte. 💛
                  </p>
                )}
                {deliveryMode === "livraison" && (
                  <div className="rounded-2xl border border-chocolate/10 bg-cream/50 p-5">
                    <label className="relative block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-grey-studio">
                        Adresse de livraison
                      </span>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setDist({ status: "idle" });
                        }}
                        onFocus={() => suggestions.length && setShowSug(true)}
                        onBlur={() => window.setTimeout(() => setShowSug(false), 180)}
                        placeholder="Rue, n°, NPA, localité"
                        autoComplete="off"
                        className={inputCls}
                      />
                      {showSug && suggestions.length > 0 && (
                        <ul className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-gold/30 bg-vanilla shadow-[0_18px_44px_-20px_rgba(74,44,32,0.4)]">
                          {suggestions.map((s) => (
                            <li key={s}>
                              <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => pickSuggestion(s)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-chocolate transition-colors hover:bg-cream"
                              >
                                {s}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </label>
                    <div className="mt-3 text-sm font-semibold" aria-live="polite">
                      {dist.status === "loading" && (
                        <span className="inline-flex items-center gap-2 text-cocoa">
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gold border-t-transparent" aria-hidden />
                          Calcul de l'itinéraire depuis l'atelier…
                        </span>
                      )}
                      {dist.status === "ok" && (
                        <span className="text-chocolate">
                          {dist.km} km depuis l'atelier —{" "}
                          {dist.fee === 0 ? (
                            <span className="text-gold">livraison offerte 💛</span>
                          ) : (
                            <>livraison CHF {dist.fee}</>
                          )}
                        </span>
                      )}
                      {dist.status === "fallback" && (
                        <span className="text-cocoa">
                          Distance à confirmer — Annie précisera les frais dans le devis.
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <button type="button" onClick={() => goTo(5)} className="btn-primary mt-6 w-full justify-center max-lg:hidden sm:w-auto">
                  Continuer →
                </button>
              </div>
              )}

              {/* 06 — Contact */}
              {step === 5 && (
              <div className="mg-step-in" aria-label="Étape 6 : vos coordonnées">
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["firstName", "Prénom", "Marie", "text"],
                      ["lastName", "Nom", "Favre", "text"],
                      ["phone", "Mobile", "+41 79 123 45 67", "tel"],
                      ["email", "E-mail", "marie@exemple.ch", "email"],
                    ] as const
                  ).map(([field, label, ph, type]) => (
                    <label key={field} className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-grey-studio">
                        {label}
                      </span>
                      <input
                        type={type}
                        value={contact[field]}
                        onChange={(e) => setContact((c) => ({ ...c, [field]: e.target.value }))}
                        placeholder={ph}
                        className={inputCls}
                      />
                    </label>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-grey-studio">
                  Vos coordonnées servent uniquement à répondre à votre demande — jamais de
                  publicité, promis.
                </p>
                <label className="mt-4 block max-w-xs">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-grey-studio">
                    Code partenaire (optionnel)
                  </span>
                  <input
                    type="text"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                    placeholder="On vous a recommandé ?"
                    className={inputCls}
                  />
                </label>
                <p className="mt-6 hidden text-sm font-semibold text-chocolate/75 lg:block">
                  Tout y est ? Envoyez votre demande depuis le récapitulatif ci-contre&nbsp;→
                </p>
              </div>
              )}

              {/* 07 — Récap (mobile) */}
              {step === 6 && (
              <div className="mg-step-in lg:hidden" aria-label="Récapitulatif">
                <div className="mx-auto max-w-sm">{ticket}</div>
              </div>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between max-lg:hidden">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm font-semibold text-chocolate/70 transition-opacity hover:text-chocolate disabled:pointer-events-none disabled:opacity-30"
              >
                <span aria-hidden>←</span> Retour
              </button>
              <span className="text-xs font-semibold tracking-[0.2em] text-grey-studio">
                {Math.min(step + 1, 6)} / 6
              </span>
              <button
                type="button"
                onClick={() => goTo(step + 1)}
                disabled={step >= maxIndex()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-chocolate/70 transition-opacity hover:text-chocolate disabled:pointer-events-none disabled:opacity-30"
              >
                Suivant <span aria-hidden>→</span>
              </button>
            </div>
          </div>

          {/* Ticket (desktop) */}
          <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
            <div className="mx-auto mb-2 w-40">
              <CakePreview tiers={tiers} styleId={style} isBirthday={isBirthday} celebrant={celebrant} />
            </div>
            {ticket}
          </aside>
        </div>
      </div>

      {/* Barre sticky mobile : estimation en direct + action principale */}
      {inView && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-vanilla/95 px-4 pt-3 shadow-[0_-12px_30px_-18px_rgba(74,44,32,0.35)] backdrop-blur-md lg:hidden"
          style={{ paddingBottom: "max(0.8rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-lg items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                aria-label="Étape précédente"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-chocolate/20 text-lg text-chocolate"
              >
                ←
              </button>
            )}
            <div className="min-w-0 shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-grey-studio">Estimation</p>
              <p className="font-display text-lg leading-none text-chocolate">
                CHF {estimate.price}
              </p>
            </div>
            {step < 5 && (
              <button type="button" onClick={() => goTo(step + 1)} className="btn-primary min-h-12 flex-1 justify-center !py-3">
                Continuer →
              </button>
            )}
            {step === 5 && (
              <button type="button" onClick={() => goTo(6)} className="btn-primary min-h-12 flex-1 justify-center !py-3">
                Mon récap →
              </button>
            )}
            {step === 6 && (
              <button
                type="button"
                onClick={submit}
                disabled={sending}
                className="btn-primary min-h-12 flex-1 justify-center !py-3 disabled:opacity-60"
              >
                {sending ? "Envoi…" : "Demander mon devis"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
