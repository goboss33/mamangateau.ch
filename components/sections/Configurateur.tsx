"use client";

/* ---------------------------------------------------------------------------
   Configurateur — « L'atelier », en carousel horizontal
   Quatre gestes qui s'enchaînent latéralement (swipe ou boutons), chaque
   choix fait glisser vers l'étape suivante. Sur mobile, le ticket récap est
   la dernière slide ; sur desktop il reste épinglé à droite. Le résultat
   part sur WhatsApp avec le message prérempli — la conversation avec Annie
   est pré-mâchée, jamais fermée.
--------------------------------------------------------------------------- */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  OCCASIONS,
  STYLES,
  FLAVOURS,
  estimatePrice,
  buildWhatsAppMessage,
  waLink,
} from "@/lib/data";

type Chip = { id: string; label: string; emoji?: string; desc?: string };

const STEPS = ["L'occasion", "Vos invités", "Le style", "Le parfum"] as const;

function ChipGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly Chip[];
  value: string | null;
  onChange: (id: string) => void;
  name: string;
}) {
  return (
    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label={name}>
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={`group rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
              active
                ? "border-chocolate bg-chocolate text-vanilla shadow-[0_12px_28px_-14px_rgba(74,44,32,0.6)]"
                : "border-chocolate/15 bg-vanilla text-chocolate hover:border-gold/60 hover:bg-cream/60"
            }`}
          >
            <span className="flex items-center gap-2 text-[15px] font-semibold">
              {o.emoji && <span aria-hidden>{o.emoji}</span>}
              {o.label}
            </span>
            {o.desc && (
              <span
                className={`mt-0.5 block text-xs ${
                  active ? "text-vanilla/70" : "text-grey-studio"
                }`}
              >
                {o.desc}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Configurateur() {
  const [occasion, setOccasion] = useState<string | null>(null);
  const [guests, setGuests] = useState(20);
  const [style, setStyle] = useState<string | null>(null);
  const [flavour, setFlavour] = useState<string | null>(null);
  const [glutenFree, setGlutenFree] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const [step, setStep] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  const price = useMemo(() => estimatePrice(guests), [guests]);
  const complete = Boolean(occasion && style && flavour);

  const labelOf = (list: readonly Chip[], id: string | null) =>
    list.find((o) => o.id === id)?.label;

  const message = buildWhatsAppMessage({
    occasion: labelOf(OCCASIONS, occasion),
    guests,
    style: labelOf(STYLES, style),
    flavour: labelOf(FLAVOURS, flavour),
    glutenFree,
  });

  /* -------------------------------------------------- pilotage carousel */
  const maxIndex = () => {
    const t = trackRef.current;
    if (!t) return 3;
    return t.querySelectorAll("[data-slide]:not(.hidden)").length - 1;
  };

  const goTo = (i: number) => {
    const t = trackRef.current;
    if (!t) return;
    const clamped = Math.max(0, Math.min(i, maxIndex()));
    t.scrollTo({ left: clamped * t.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    setStep(Math.round(t.scrollLeft / t.clientWidth));
  };

  /* re-calage au resize (changement de breakpoint) */
  useEffect(() => {
    const onResize = () => {
      const t = trackRef.current;
      if (!t) return;
      t.scrollTo({ left: Math.min(step, maxIndex()) * t.clientWidth });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [step]);

  const advance = (from: number) => {
    window.setTimeout(() => goTo(from + 1), 260);
  };

  const maybeCelebrate = (nextComplete: boolean) => {
    if (nextComplete && !celebrated) {
      setCelebrated(true);
      window.dispatchEvent(new CustomEvent("mg:burst"));
    }
  };

  const fillPct = ((guests - 6) / (80 - 6)) * 100;

  /* ------------------------------------------------------------ ticket */
  const ticket = (
    <>
      <div className="ticket relative px-7 pb-2 pt-7">
        <p className="script-accent text-3xl">Votre gâteau</p>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-grey-studio">
          Récapitulatif
        </p>

        <dl className="mt-6 space-y-4 text-[15px]">
          {[
            ["Occasion", labelOf(OCCASIONS, occasion) ?? "—"],
            ["Invités", `${guests}${guests >= 80 ? "+" : ""}`],
            ["Style", labelOf(STYLES, style) ?? "—"],
            [
              "Parfum",
              (labelOf(FLAVOURS, flavour) ?? "—") + (glutenFree ? " · sans gluten" : ""),
            ],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 font-semibold text-grey-studio">{k}</dt>
              <dd className="text-right font-semibold text-chocolate">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="dashed-sep mt-6 pt-5">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-grey-studio">Estimation</span>
            <span className="font-display text-3xl text-chocolate">
              CHF {price.from}–{price.to}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-grey-studio">
            À titre indicatif — chaque création est unique, Annie affine avec vous selon
            le décor et les détails.
          </p>
        </div>

        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => window.dispatchEvent(new CustomEvent("mg:burst"))}
          className={`btn-primary mt-6 w-full justify-center !bg-[#25D366] transition-opacity ${
            complete ? "" : "pointer-events-none opacity-40"
          }`}
          aria-disabled={!complete}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.16L2.1 21.9l4.87-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.67a8.23 8.23 0 1 1-4.2 15.3l-.3-.18-2.89.89.9-2.82-.2-.31a8.23 8.23 0 0 1 6.7-12.88Zm-3.1 3.83c-.2 0-.5.07-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.77 1.17 2.96.14.19 2 3.05 4.83 4.15 2.35.93 2.83.74 3.34.7.5-.05 1.63-.67 1.86-1.32.23-.64.23-1.2.16-1.31-.07-.12-.26-.19-.55-.33-.28-.14-1.63-.8-1.88-.9-.25-.09-.44-.14-.62.14-.19.29-.72.9-.88 1.09-.16.19-.32.21-.6.07a7.5 7.5 0 0 1-2.2-1.36 8.27 8.27 0 0 1-1.53-1.9c-.16-.28-.02-.43.12-.57.13-.13.29-.33.43-.5.14-.16.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.62-1.5-.86-2.06-.22-.53-.45-.65-.62-.65h-.66Z" />
          </svg>
          {complete ? "Envoyer à Annie sur WhatsApp" : "Complétez les 4 gestes"}
        </a>

        <p className="pb-4 pt-3 text-center text-[11px] text-grey-studio">
          Sans engagement — vous discutez directement avec Annie.
        </p>
      </div>
      <div className="ticket-edge" aria-hidden />
    </>
  );

  return (
    <section id="configurateur" className="relative overflow-hidden bg-vanilla py-24 md:py-32">
      {/* Nappe blush très diluée derrière le ticket */}
      <div
        className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(246,201,212,0.5) 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p data-reveal className="eyebrow mb-4">L'atelier</p>
          <h2 data-reveal className="section-title">
            Composez votre gâteau
            <span className="script-accent block pt-2 text-[clamp(2.4rem,6vw,4.4rem)]">
              en quatre gestes
            </span>
          </h2>
          <p data-reveal className="mt-6 leading-relaxed text-cocoa">
            Un geste après l'autre — et à la fin, votre projet part directement dans la
            conversation WhatsApp d'Annie, prêt à être affiné ensemble.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* ------------------------------------------------ le carousel */}
          <div data-reveal>
            {/* Progression */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 sm:gap-3">
                {STEPS.map((s, i) => {
                  const active = Math.min(step, 3) === i;
                  const done =
                    (i === 0 && occasion) || (i === 2 && style) || (i === 3 && flavour);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => goTo(i)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                        active
                          ? "border-chocolate bg-chocolate text-vanilla"
                          : done
                            ? "border-gold/60 bg-cream text-chocolate"
                            : "border-chocolate/15 text-chocolate/60 hover:border-gold/50"
                      }`}
                    >
                      <span className="font-display" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="max-sm:hidden">{s}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 h-px w-full bg-gold/15">
                <div
                  className="h-full bg-gold transition-all duration-500 ease-out"
                  style={{ width: `${(Math.min(step, 3) / 3) * 100 || 4}%` }}
                />
              </div>
            </div>

            {/* Piste */}
            <div
              ref={trackRef}
              onScroll={onScroll}
              data-lenis-prevent
              role="group"
              aria-roledescription="carrousel"
              aria-label="Étapes du configurateur"
              className="no-scrollbar -mx-1 flex snap-x snap-mandatory overflow-x-auto"
            >
              {/* 01 — Occasion */}
              <div data-slide className="w-full shrink-0 snap-center px-1" aria-label="Étape 1 : l'occasion">
                <ChipGroup
                  name="Occasion"
                  options={OCCASIONS}
                  value={occasion}
                  onChange={(id) => {
                    setOccasion(id);
                    maybeCelebrate(Boolean(id && style && flavour));
                    advance(0);
                  }}
                />
              </div>

              {/* 02 — Invités */}
              <div data-slide className="w-full shrink-0 snap-center px-1" aria-label="Étape 2 : vos invités">
                <div className="rounded-2xl border border-chocolate/10 bg-cream/50 p-6">
                  <div className="mb-5 flex items-baseline justify-between">
                    <span className="font-display text-4xl text-chocolate">
                      {guests}
                      {guests >= 80 && "+"}
                    </span>
                    <span className="text-sm font-semibold text-cocoa">
                      invités · ≈ {guests} parts
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={80}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                    className="mg-range"
                    style={{ "--fill": `${fillPct}%` } as React.CSSProperties}
                    aria-label="Nombre d'invités"
                  />
                  <div className="mt-2 flex justify-between text-xs text-grey-studio">
                    <span>6</span>
                    <span>80+</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => goTo(2)}
                  className="btn-primary mt-5 w-full justify-center sm:w-auto"
                >
                  C'est noté →
                </button>
              </div>

              {/* 03 — Style */}
              <div data-slide className="w-full shrink-0 snap-center px-1" aria-label="Étape 3 : le style">
                <ChipGroup
                  name="Style"
                  options={STYLES}
                  value={style}
                  onChange={(id) => {
                    setStyle(id);
                    maybeCelebrate(Boolean(occasion && id && flavour));
                    advance(2);
                  }}
                />
              </div>

              {/* 04 — Parfum */}
              <div data-slide className="w-full shrink-0 snap-center px-1" aria-label="Étape 4 : le parfum">
                <ChipGroup
                  name="Parfum"
                  options={FLAVOURS}
                  value={flavour}
                  onChange={(id) => {
                    setFlavour(id);
                    maybeCelebrate(Boolean(occasion && style && id));
                    /* sur mobile, on glisse vers le récapitulatif */
                    if (window.innerWidth < 1024) advance(3);
                  }}
                />
                <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 text-sm text-cocoa">
                  <input
                    type="checkbox"
                    checked={glutenFree}
                    onChange={(e) => setGlutenFree(e.target.checked)}
                    className="h-4 w-4 accent-gold"
                  />
                  Version sans gluten (sur demande)
                </label>
              </div>

              {/* 05 — Récapitulatif (mobile uniquement) */}
              <div data-slide className="hidden w-full shrink-0 snap-center px-1 max-lg:block" aria-label="Récapitulatif">
                <div className="mx-auto max-w-sm">{ticket}</div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm font-semibold text-chocolate/70 transition-opacity hover:text-chocolate disabled:pointer-events-none disabled:opacity-30"
              >
                <span aria-hidden>←</span> Retour
              </button>
              <span className="text-xs font-semibold tracking-[0.2em] text-grey-studio">
                {Math.min(step + 1, 4)} / 4
              </span>
              <button
                type="button"
                onClick={() => goTo(step + 1)}
                disabled={step >= (typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 4)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-chocolate/70 transition-opacity hover:text-chocolate disabled:pointer-events-none disabled:opacity-30"
              >
                Suivant <span aria-hidden>→</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------- ticket (desktop) */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start" data-reveal="scale">
            {ticket}
          </aside>
        </div>
      </div>
    </section>
  );
}
