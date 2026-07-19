"use client";

/* ---------------------------------------------------------------------------
   Wordmark « retour accueil » (desktop, pages internes).
   Pixel-près ET couleurs de marque exactes : deux calques superposés du même
   texte — CHOCOLAT dessous, VANILLE dessus, ce dernier découpé en direct pour
   n'apparaître que sur la portion posée sur un fond foncé. La coupe suit
   exactement la frontière de section → net au pixel, vraies couleurs.

   ┌─────────────────────────────────────────────────────────────────────┐
   │ IMPORTANT — pour qu'une NOUVELLE section à fond foncé fasse passer le │
   │ logo en vanille, lui ajouter l'attribut : data-nav-dark               │
   │ (sur le <section> qui porte bg-chocolate/deep). Voir docs/NAV-DARK.md.│
   └─────────────────────────────────────────────────────────────────────┘

   Coût : un getBoundingClientRect + une maj de clip-path, throttlés par
   requestAnimationFrame, uniquement au scroll/resize.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function HomeWordmark() {
  const pathname = usePathname();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const near = new Set<Element>(); // sections foncées proches du haut de l'écran
    let sections: Element[] = [];
    let io: IntersectionObserver | null = null;

    const update = () => {
      raf = 0;
      const link = linkRef.current, overlay = overlayRef.current;
      if (!link || !overlay) return;
      const r = link.getBoundingClientRect();
      let top: number | null = null, bottom: number | null = null;
      // ne mesure QUE les sections signalées « proches » par l'observer
      for (const s of near) {
        const b = s.getBoundingClientRect();
        const t = Math.max(r.top, b.top);
        const bt = Math.min(r.bottom, b.bottom);
        if (bt > t) {
          top = top === null ? t : Math.min(top, t);
          bottom = bottom === null ? bt : Math.max(bottom, bt);
        }
      }
      overlay.style.clipPath =
        top === null
          ? "inset(0 0 100% 0)"
          : `inset(${Math.max(0, top - r.top)}px 0 ${Math.max(0, r.bottom - bottom!)}px 0)`;
    };

    const onScroll = () => { if (near.size && !raf) raf = requestAnimationFrame(update); };

    const build = () => {
      io?.disconnect();
      near.clear();
      sections = Array.from(document.querySelectorAll("[data-nav-dark]"));
      // « zone d'intérêt » : les ~120 premiers px de l'écran (le logo y vit).
      // Le clip précis ne se calcule que pendant qu'une section y transite.
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) near.add(e.target);
            else near.delete(e.target);
          }
          update(); // recalage immédiat (entrée/sortie), puis rAF pendant le transit
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - 120)}px 0px`, threshold: 0 }
      );
      sections.forEach((s) => io!.observe(s));
      update();
    };

    const t = window.setTimeout(build, 60); // DOM monté (après navigation)
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", build);
    return () => {
      window.clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", build);
    };
  }, [pathname]);

  return (
    <Link
      ref={linkRef}
      href="/"
      aria-label="Retour à l'accueil"
      className="font-script fixed left-8 top-[1.35rem] z-40 hidden text-2xl leading-none transition-opacity hover:opacity-70 md:block"
    >
      <span className="relative block whitespace-nowrap py-[0.28em]" style={{ color: "var(--color-chocolate)" }}>
        Maman Gâteau
        <span
          ref={overlayRef}
          aria-hidden
          className="absolute inset-0 whitespace-nowrap py-[0.28em]"
          style={{ color: "var(--color-vanilla)", clipPath: "inset(0 0 100% 0)" }}
        >
          Maman Gâteau
        </span>
      </span>
    </Link>
  );
}
