"use client";

/* ---------------------------------------------------------------------------
   ThemeField — champ thème du configurateur (étape 4).
   Desktop : dropdown sous le champ (pastilles contextuelles en tête,
   liste alphabétique, filtre dès 2 lettres, data-lenis-prevent).
   Mobile (< 768px) : le champ est un déclencheur — la recherche s'ouvre
   dans une surcouche plein écran (100dvh, clavier géré), pastilles +
   liste captive. Saisie libre limitée à 60 caractères, compteur visible.
--------------------------------------------------------------------------- */

import { useEffect, useMemo, useRef, useState } from "react";
import { THEME_SUGGESTIONS, topThemesFor } from "@/lib/data";

const MAX = 60;
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const ALL_SORTED = [...THEME_SUGGESTIONS].sort((a, b) => a.localeCompare(b, "fr"));

function useMatches(value: string) {
  return useMemo(() => {
    const q = norm(value.trim());
    if (q.length < 2) return { list: ALL_SORTED, browsing: true };
    const starts: string[] = [];
    const contains: string[] = [];
    for (const s of THEME_SUGGESTIONS) {
      const n = norm(s);
      if (n === q) continue;
      if (n.startsWith(q)) starts.push(s);
      else if (n.includes(q)) contains.push(s);
    }
    return { list: [...starts, ...contains].slice(0, 12), browsing: false };
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
  const { list, browsing } = useMatches(value);

  const pick = (s: string) => { onChange(s.slice(0, MAX)); setOpen(false); setHi(-1); };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || list.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % list.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + list.length) % list.length); }
    else if (e.key === "Enter") { if (hi >= 0) { e.preventDefault(); pick(list[hi]); } else setOpen(false); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className="mg-beam-wrap">
      <input
        type="text" role="combobox" aria-expanded={open && list.length > 0} aria-autocomplete="list" aria-controls="theme-suggestions"
        value={value} maxLength={MAX}
        onChange={(e) => { onChange(e.target.value.slice(0, MAX)); setOpen(true); setHi(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => { setOpen(false); setHi(-1); }, 120)}
        onKeyDown={onKey}
        placeholder="Ex. licorne pastel, dinosaures, fleurs champêtres…"
        className={`${inputCls} relative bg-white`}
      />
      <Counter value={value} className="absolute -bottom-5 right-1" />
      {open && list.length > 0 && (
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
          <ul id="theme-suggestions" role="listbox" className="max-h-52 overflow-y-auto overscroll-contain py-1.5">
            {list.map((s, i) => (
              <li key={s} role="option" aria-selected={i === hi}>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); pick(s); }} onMouseEnter={() => setHi(i)}
                  className={`block w-full px-4 py-2 text-left text-[15px] transition-colors ${i === hi ? "bg-cream text-chocolate" : "text-cocoa"}`}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
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
  const { list, browsing } = useMatches(draft);

  const openSheet = () => { setDraft(value); setOpen(true); };
  const close = (commit: boolean) => {
    if (commit) onChange(draft.trim().slice(0, MAX));
    setOpen(false);
  };
  const pick = (s: string) => { onChange(s.slice(0, MAX)); setOpen(false); };

  // verrouille le fond + focus la recherche à l'ouverture
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => searchRef.current?.focus(), 180); // après l'animation
    return () => { document.body.style.overflow = prev; clearTimeout(t); };
  }, [open]);

  return (
    <div className="mg-beam-wrap">
      {/* déclencheur — pas de clavier ici */}
      <input
        type="text" readOnly value={value} onClick={openSheet} onFocus={(e) => { e.target.blur(); openSheet(); }}
        placeholder="Ex. licorne, dinosaures, fleurs…"
        className={`${inputCls} relative cursor-pointer bg-white`}
        aria-haspopup="dialog"
      />
      <Counter value={value} className="absolute -bottom-5 right-1" />

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Choisir le thème" className="mg-sheet fixed inset-0 z-50 flex flex-col bg-cream">
          {/* barre de recherche */}
          <div className="flex items-center gap-2 border-b border-gold/20 bg-vanilla px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))]">
            <div className="relative flex-1">
              <input
                ref={searchRef} type="text" value={draft} maxLength={MAX}
                onChange={(e) => setDraft(e.target.value.slice(0, MAX))}
                onKeyDown={(e) => { if (e.key === "Enter") close(true); }}
                enterKeyHint="done"
                placeholder="Cherchez ou écrivez votre thème…"
                className="w-full rounded-xl border border-gold/40 bg-white px-4 py-3 pr-14 text-[16px] text-chocolate outline-none focus:border-gold"
              />
              <Counter value={draft} className="absolute right-3 top-1/2 -translate-y-1/2" />
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
                  className="rounded-full border border-chocolate/20 bg-white px-4 py-1.5 text-[13px] font-medium text-cocoa">
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* liste captive */}
          <ul data-lenis-prevent role="listbox" className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
            {list.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => pick(s)} className="block w-full border-b border-gold/10 px-5 py-3 text-left text-[15px] text-cocoa active:bg-cream">
                  {s}
                </button>
              </li>
            ))}
            {list.length === 0 && (
              <li className="px-5 py-6 text-center text-[14px] text-grey-studio">
                Aucune suggestion — votre idée est unique, validez-la avec OK ✨
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
