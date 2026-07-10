"use client";

/* ---------------------------------------------------------------------------
   Configurateur — « L'atelier »
   Pièce maîtresse de conversion : on compose son gâteau en 4 gestes,
   l'estimation s'affiche en direct, et le récapitulatif part sur WhatsApp
   avec un message prérempli — la conversation avec Annie est pré-mâchée,
   jamais fermée (pas de tunnel e-commerce, chaque pièce est unique).
--------------------------------------------------------------------------- */

import { useMemo, useState } from "react";
import {
  OCCASIONS,
  STYLES,
  FLAVOURS,
  estimatePrice,
  buildWhatsAppMessage,
  waLink,
} from "@/lib/data";

type Chip = { id: string; label: string; emoji?: string; desc?: string };

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

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="mb-5 flex items-baseline gap-3">
      <span className="font-display text-xl text-gold" aria-hidden>
        {String(n).padStart(2, "0")}
      </span>
      <span className="font-display text-2xl text-chocolate md:text-[1.6rem]">{children}</span>
    </h3>
  );
}

export default function Configurateur() {
  const [occasion, setOccasion] = useState<string | null>(null);
  const [guests, setGuests] = useState(20);
  const [style, setStyle] = useState<string | null>(null);
  const [flavour, setFlavour] = useState<string | null>(null);
  const [glutenFree, setGlutenFree] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

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

  const maybeCelebrate = (nextComplete: boolean) => {
    if (nextComplete && !celebrated) {
      setCelebrated(true);
      window.dispatchEvent(new CustomEvent("mg:burst"));
    }
  };

  const fillPct = ((guests - 6) / (80 - 6)) * 100;

  return (
    <section id="configurateur" className="relative overflow-hidden bg-vanilla py-24 md:py-32">
      {/* Nappe blush très diluée derrière le ticket */}
      <div
        className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(246,201,212,0.5) 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl md:mb-20">
          <p data-reveal className="eyebrow mb-4">L'atelier</p>
          <h2 data-reveal className="section-title">
            Composez votre gâteau
            <span className="script-accent block pt-2 text-[clamp(2.4rem,6vw,4.4rem)]">
              en quatre gestes
            </span>
          </h2>
          <p data-reveal className="mt-6 leading-relaxed text-cocoa">
            Un jeu d'enfant — et à la fin, votre projet part directement dans la
            conversation WhatsApp d'Annie, prêt à être affiné ensemble.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* ------------------------------------------------ les 4 gestes */}
          <div className="space-y-12 md:space-y-14">
            <div data-reveal>
              <StepLabel n={1}>L'occasion</StepLabel>
              <ChipGroup
                name="Occasion"
                options={OCCASIONS}
                value={occasion}
                onChange={(id) => {
                  setOccasion(id);
                  maybeCelebrate(Boolean(id && style && flavour));
                }}
              />
            </div>

            <div data-reveal>
              <StepLabel n={2}>Vos invités</StepLabel>
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
            </div>

            <div data-reveal>
              <StepLabel n={3}>Le style</StepLabel>
              <ChipGroup
                name="Style"
                options={STYLES}
                value={style}
                onChange={(id) => {
                  setStyle(id);
                  maybeCelebrate(Boolean(occasion && id && flavour));
                }}
              />
            </div>

            <div data-reveal>
              <StepLabel n={4}>Le parfum</StepLabel>
              <ChipGroup
                name="Parfum"
                options={FLAVOURS}
                value={flavour}
                onChange={(id) => {
                  setFlavour(id);
                  maybeCelebrate(Boolean(occasion && style && id));
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
          </div>

          {/* ------------------------------------------------- le ticket */}
          <aside className="lg:sticky lg:top-24 lg:self-start" data-reveal="scale">
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
                  À titre indicatif — chaque création est unique, Annie affine avec vous
                  selon le décor et les détails.
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
          </aside>
        </div>
      </div>
    </section>
  );
}
