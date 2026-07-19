"use client";

/* Wordmark « retour accueil » (desktop) qui prend la couleur de marque
   opposée au fond réel sous lui : chocolat sur zone claire, vanille sur
   zone foncée. Détection par luminance de l'élément derrière le logo au
   scroll (rAF throttlé) — couleurs exactes, transition douce. */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HomeWordmark() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [dark, setDark] = useState(false); // true = fond foncé → texte vanille

  useEffect(() => {
    let raf = 0;
    const sample = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const stack = document.elementsFromPoint(x, y) as HTMLElement[];
      let lum = 255;
      for (const node of stack) {
        if (el.contains(node)) continue; // ignore le logo lui-même
        const bg = getComputedStyle(node).backgroundColor;
        const m = bg.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
        if (m && (m[4] === undefined || Number(m[4]) > 0.4)) {
          lum = 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3];
          break;
        }
      }
      setDark(lum < 140);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(sample); };
    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href="/"
      aria-label="Retour à l'accueil"
      className="font-script fixed left-8 top-7 z-40 hidden text-2xl transition-colors duration-300 hover:opacity-70 md:block"
      style={{ color: dark ? "var(--color-vanilla)" : "var(--color-chocolate)" }}
    >
      Maman Gâteau
    </Link>
  );
}
