"use client";

/* ---------------------------------------------------------------------------
   ThemeField — champ thème du configurateur (étape 4).
   · Faisceau doré animé autour du champ (globals.css .mg-beam-wrap)
   · Au clic : la liste s'ouvre en ordre alphabétique ; dès 2 lettres elle
     filtre (insensible aux accents), clavier + tactile
   · Pastilles : top 5 populaires + « Carte blanche à Annie »
   · Saisie libre limitée à 60 caractères, compteur visible en tapant
--------------------------------------------------------------------------- */

import { useMemo, useState } from "react";
import { THEME_SUGGESTIONS, TOP_THEMES, CARTE_BLANCHE } from "@/lib/data";

const MAX = 60;
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const ALL_SORTED = [...THEME_SUGGESTIONS].sort((a, b) => a.localeCompare(b, "fr"));

export default function ThemeField({
  value, onChange, inputCls,
}: {
  value: string;
  onChange: (v: string) => void;
  inputCls: string;
}) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1); // index surligné (-1 : rien)

  const matches = useMemo(() => {
    const q = norm(value.trim());
    if (q.length < 2) return ALL_SORTED; // liste complète, ordre alphabétique
    const starts: string[] = [];
    const contains: string[] = [];
    for (const s of THEME_SUGGESTIONS) {
      const n = norm(s);
      if (n === q) continue;
      if (n.startsWith(q)) starts.push(s);
      else if (n.includes(q)) contains.push(s);
    }
    return [...starts, ...contains].slice(0, 9);
  }, [value]);

  const pick = (s: string) => {
    onChange(s.slice(0, MAX));
    setOpen(false);
    setHi(-1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % matches.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + matches.length) % matches.length); }
    else if (e.key === "Enter") { if (hi >= 0) { e.preventDefault(); pick(matches[hi]); } else setOpen(false); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div>
      <div className="mg-beam-wrap">
        <input
          type="text"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-autocomplete="list"
          aria-controls="theme-suggestions"
          value={value}
          maxLength={MAX}
          onChange={(e) => { onChange(e.target.value.slice(0, MAX)); setOpen(true); setHi(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => { setOpen(false); setHi(-1); }, 120)}
          onKeyDown={onKey}
          placeholder="Ex. licorne pastel, dinosaures, fleurs champêtres…"
          className={`${inputCls} relative bg-white`}
        />
        {value.length > 0 && (
          <span
            aria-live="polite"
            className={`pointer-events-none absolute -bottom-5 right-1 text-[11px] tabular-nums ${value.length >= MAX ? "font-semibold text-chocolate" : "text-grey-studio"}`}
          >
            {value.length}/{MAX}
          </span>
        )}
        {open && matches.length > 0 && (
          <ul
            id="theme-suggestions"
            role="listbox"
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto overscroll-contain rounded-2xl border border-gold/30 bg-white py-1.5 shadow-[0_24px_48px_-20px_rgba(74,44,32,0.35)]"
          >
            {matches.map((s, i) => (
              <li key={s} role="option" aria-selected={i === hi}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); pick(s); }}
                  onMouseEnter={() => setHi(i)}
                  className={`block w-full px-4 py-2 text-left text-[15px] transition-colors ${i === hi ? "bg-cream text-chocolate" : "text-cocoa"}`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* pastilles : populaires + carte blanche */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {TOP_THEMES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => pick(t)}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${value === t ? "border-chocolate bg-chocolate text-vanilla" : "border-chocolate/20 bg-white/60 text-cocoa hover:border-chocolate/50 hover:text-chocolate"}`}
          >
            {t}
          </button>
        ))}
        <button
          type="button"
          onClick={() => pick(CARTE_BLANCHE)}
          className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${value === CARTE_BLANCHE ? "border-gold bg-gold text-white" : "border-gold/50 bg-gold/10 text-chocolate hover:bg-gold/25"}`}
        >
          ✨ Carte blanche à Annie
        </button>
      </div>
    </div>
  );
}
