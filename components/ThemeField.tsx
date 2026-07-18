"use client";

/* ---------------------------------------------------------------------------
   ThemeField — champ thème du configurateur (étape 4).
   Desktop : dropdown (pastilles + sections en découverte, filtre dès
   2 lettres, scroll captif data-lenis-prevent).
   Mobile : le champ est un déclencheur ; la recherche s'ouvre en surcouche
   VRAIMENT plein écran (portal vers <body> — un fixed dans un ancêtre
   transformé par GSAP serait piégé) : PAS de clavier à l'ouverture, on
   parcourt pastilles + sections au doigt ; le clavier ne vient qu'au tap
   sur la barre, et se replie dès qu'on fait défiler la liste (pattern
   Apple/Google Maps). 60 caractères max, compteur visible.
--------------------------------------------------------------------------- */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { THEME_SECTIONS, THEME_SUGGESTIONS, topThemesFor } from "@/lib/data";

const MAX = 60;
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function useFiltered(value: string) {
  return useMemo(() => {
    const q = norm(value.trim());
    if (q.length < 2) return { flat: [] as string[], browsing: true };
    const starts: string[] = [];
    const contains: string[] = [];
    for (const s of THEME_SUGGESTIONS) {
      const n = norm(s);
      if (n === q) continue;
      if (n.startsWith(q)) starts.push(s);
      else if (n.includes(q)) contains.push(s);
    }
    return { flat: [...starts, ...contains].slice(0, 12), browsing: false };
  }, [value]);
}

function Counter({ value, className = "" }: { value: string; className?: string }) {
  if (!value.length) return null;
  return (
    <span aria-live="polite" className={`pointer-events-none text-[11px] tabular-nums ${value.length >= MAX ? "font-semibold text-chocolate" : "text-grey-studio"} ${className}`}>
      {value.length}/{MAX}
    </span>
  );
}

/* petites icônes inline (le site n'embarque pas de lib d'icônes) */
const I = {
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-[18px]"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></svg>,
  keyboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-5"><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10h.01M10.25 10h.01M14 10h.01M17.75 10h.01M7.5 14h9" /></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5"><path d="M6 6l12 12M18 6L6 18" /></svg>,
};

/* liste groupée par sections, en-têtes collantes */
function SectionedList({ onPick }: { onPick: (s: string) => void }) {
  return (
    <>
      {THEME_SECTIONS.map((sec) => (
        <div key={sec.label}>
          <p className="sticky top-0 z-10 border-b border-gold/15 bg-vanilla px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-grey-studio">
            {sec.label}
          </p>
          {sec.items.map((s) => (
            <button
              key={s} type="button"
              onMouseDown={(e) => { e.preventDefault(); onPick(s); }}
              className="block w-full border-b border-gold/10 px-5 py-2.5 text-left text-[15px] text-cocoa transition-colors hover:bg-cream active:bg-cream"
            >
              {s}
            </button>
          ))}
        </div>
      ))}
    </>
  );
}

export default function ThemeField({
  value, onChange, inputCls, occasion = null, age = null,
}: {
  value: string;
  onChange: (v: string) => void;
  inputCls: string;
  occasion?: string | null;
  age?: number | null;
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const tops = useMemo(() => topThemesFor(occasion, age), [occasion, age]);

  return isMobile
    ? <MobileField value={value} onChange={onChange} inputCls={inputCls} tops={tops} />
    : <DesktopField value={value} onChange={onChange} inputCls={inputCls} tops={tops} />;
}

/* ============================================================== desktop */
function DesktopField({ value, onChange, inputCls, tops }: { value: string; onChange: (v: string) => void; inputCls: string; tops: string[] }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const { flat, browsing } = useFiltered(value);

  const pick = (s: string) => { onChange(s.slice(0, MAX)); setOpen(false); setHi(-1); };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") { setOpen(false); return; }
    if (browsing || flat.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % flat.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + flat.length) % flat.length); }
    else if (e.key === "Enter") { if (hi >= 0) { e.preventDefault(); pick(flat[hi]); } else setOpen(false); }
  };

  return (
    <div className="mg-beam-wrap">
      <input
        type="text" role="combobox" aria-expanded={open} aria-autocomplete="list" aria-controls="theme-suggestions"
        value={value} maxLength={MAX}
        onChange={(e) => { onChange(e.target.value.slice(0, MAX)); setOpen(true); setHi(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => { setOpen(false); setHi(-1); }, 120)}
        onKeyDown={onKey}
        placeholder="Ex. licorne pastel, dinosaures, fleurs champêtres…"
        className={`${inputCls} relative bg-white`}
      />
      <Counter value={value} className="absolute -bottom-5 right-1" />
      {open && (
        <div data-lenis-prevent className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-[0_24px_48px_-20px_rgba(74,44,32,0.35)]">
          {browsing && (
            <div className="flex flex-wrap items-center gap-1.5 border-b border-gold/15 bg-cream/60 px-3 py-2.5">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-grey-studio">Populaires</span>
              {tops.map((t) => (
                <button key={t} type="button" onMouseDown={(e) => { e.preventDefault(); pick(t); }}
                  className="rounded-full border border-chocolate/20 bg-white px-3 py-1 text-[12px] font-medium text-cocoa transition-colors hover:border-chocolate/50 hover:text-chocolate">
                  {t}
                </button>
              ))}
            </div>
          )}
          <div id="theme-suggestions" role="listbox" className="max-h-56 overflow-y-auto overscroll-contain">
            {browsing ? (
              <SectionedList onPick={pick} />
            ) : flat.length > 0 ? (
              flat.map((s, i) => (
                <button
                  key={s} type="button" role="option" aria-selected={i === hi}
                  onMouseDown={(e) => { e.preventDefault(); pick(s); }} onMouseEnter={() => setHi(i)}
                  className={`block w-full px-4 py-2 text-left text-[15px] transition-colors ${i === hi ? "bg-cream text-chocolate" : "text-cocoa"}`}
                >
                  {s}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-[13px] text-grey-studio">Aucune suggestion — votre idée est la bienvenue telle quelle ✨</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =============================================================== mobile */
function MobileField({ value, onChange, inputCls, tops }: { value: string; onChange: (v: string) => void; inputCls: string; tops: string[] }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const searchRef = useRef<HTMLInputElement>(null);
  const { flat, browsing } = useFiltered(draft);

  const openSheet = () => { setDraft(value); setOpen(true); };
  const close = (commit: boolean) => {
    if (commit && draft.trim()) onChange(draft.trim().slice(0, MAX));
    setOpen(false);
  };
  const pick = (s: string) => { onChange(s.slice(0, MAX)); setOpen(false); };

  // verrouille le fond — PAS d'autofocus : le clavier ne vient que sur intention
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // défiler la liste replie le clavier (pattern Apple / Google Maps)
  const dismissKeyboard = () => {
    if (document.activeElement === searchRef.current) searchRef.current?.blur();
  };

  const sheet = (
    <div role="dialog" aria-modal="true" aria-label="Choisir le thème" className="mg-sheet fixed inset-0 z-90 flex flex-col bg-cream">
      {/* barre : fermer · champ (clavier au tap) · OK */}
      <div className="flex items-center gap-2 border-b border-gold/20 bg-vanilla px-3 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <button type="button" onClick={() => close(false)} aria-label="Fermer" className="shrink-0 rounded-xl p-2.5 text-cocoa">
          {I.close}
        </button>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-studio">{I.search}</span>
          <input
            ref={searchRef} type="text" value={draft} maxLength={MAX}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX))}
            onKeyDown={(e) => { if (e.key === "Enter") close(true); }}
            enterKeyHint="done"
            placeholder="Cherchez ou écrivez…"
            className="w-full rounded-xl border border-gold/40 bg-white py-3 pl-10 pr-12 text-[16px] text-chocolate outline-none focus:border-gold"
          />
          {draft.length > 0 ? (
            <Counter value={draft} className="absolute right-3 top-1/2 -translate-y-1/2" />
          ) : (
            <button
              type="button" aria-label="Écrire mon thème"
              onClick={() => searchRef.current?.focus()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-grey-studio active:text-chocolate"
            >
              {I.keyboard}
            </button>
          )}
        </div>
        <button type="button" onClick={() => close(true)} className="shrink-0 rounded-xl bg-chocolate px-4 py-3 text-[14px] font-semibold text-vanilla">
          OK
        </button>
      </div>

      {/* pastilles contextuelles */}
      {browsing && (
        <div className="flex flex-wrap gap-2 border-b border-gold/15 px-4 py-3">
          {tops.map((t) => (
            <button key={t} type="button" onClick={() => pick(t)}
              className="rounded-full border border-chocolate/20 bg-white px-4 py-1.5 text-[13px] font-medium text-cocoa active:bg-cream">
              {t}
            </button>
          ))}
        </div>
      )}

      {/* liste captive plein écran */}
      <div
        data-lenis-prevent role="listbox"
        onTouchMove={dismissKeyboard} onWheel={dismissKeyboard}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]"
      >
        {browsing ? (
          <SectionedList onPick={pick} />
        ) : flat.length > 0 ? (
          flat.map((s) => (
            <button key={s} type="button" onClick={() => pick(s)}
              className="block w-full border-b border-gold/10 px-5 py-3 text-left text-[15px] text-cocoa active:bg-cream">
              {s}
            </button>
          ))
        ) : (
          <p className="px-5 py-6 text-center text-[14px] text-grey-studio">
            Aucune suggestion — votre idée est unique, validez-la avec OK ✨
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="mg-beam-wrap">
      <input
        type="text" readOnly value={value} onClick={openSheet} onFocus={(e) => { e.target.blur(); openSheet(); }}
        placeholder="Ex. licorne, dinosaures, fleurs…"
        className={`${inputCls} relative cursor-pointer bg-white`}
        aria-haspopup="dialog"
      />
      <Counter value={value} className="absolute -bottom-5 right-1" />
      {open && createPortal(sheet, document.body)}
    </div>
  );
}
