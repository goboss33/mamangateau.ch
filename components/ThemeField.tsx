"use client";

/* ---------------------------------------------------------------------------
   ThemeField — champ thème du configurateur (étape 4).
   Autocomplete façon moteur de recherche sur une base locale très fournie
   (lib/data THEME_SUGGESTIONS) : filtre dès 2 lettres, insensible aux
   accents, navigation clavier, saisie libre limitée à 60 caractères avec
   compteur visible pendant la frappe.
--------------------------------------------------------------------------- */

import { useMemo, useRef, useState } from "react";
import { THEME_SUGGESTIONS } from "@/lib/data";

const MAX = 60;
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function ThemeField({
  value, onChange, inputCls,
}: {
  value: string;
  onChange: (v: string) => void;
  inputCls: string;
}) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0); // index surligné
  const listRef = useRef<HTMLUListElement>(null);

  const matches = useMemo(() => {
    const q = norm(value.trim());
    if (q.length < 2) return [];
    const starts: string[] = [];
    const contains: string[] = [];
    for (const s of THEME_SUGGESTIONS) {
      const n = norm(s);
      if (n === q) continue; // déjà tapé tel quel
      if (n.startsWith(q)) starts.push(s);
      else if (n.includes(q)) contains.push(s);
      if (starts.length >= 8) break;
    }
    return [...starts, ...contains].slice(0, 8);
  }, [value]);

  const pick = (s: string) => {
    onChange(s.slice(0, MAX));
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % matches.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + matches.length) % matches.length); }
    else if (e.key === "Enter") { e.preventDefault(); pick(matches[hi] ?? value); }
    else if (e.key === "Escape") setOpen(false);
  };

  const showList = open && matches.length > 0;

  return (
    <div className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-autocomplete="list"
        aria-controls="theme-suggestions"
        value={value}
        maxLength={MAX}
        onChange={(e) => { onChange(e.target.value.slice(0, MAX)); setOpen(true); setHi(0); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKey}
        placeholder="Ex. licorne pastel, dinosaures, fleurs champêtres, Pat'Patrouille…"
        className={inputCls}
      />
      {value.length > 0 && (
        <span
          aria-live="polite"
          className={`pointer-events-none absolute -bottom-5 right-1 text-[11px] tabular-nums ${value.length >= MAX ? "font-semibold text-chocolate" : "text-grey-studio"}`}
        >
          {value.length}/{MAX}
        </span>
      )}
      {showList && (
        <ul
          id="theme-suggestions"
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-64 overflow-y-auto rounded-2xl border border-gold/30 bg-white py-1.5 shadow-[0_24px_48px_-20px_rgba(74,44,32,0.35)]"
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
  );
}
