"use client";

/* ---------------------------------------------------------------------------
   Experience — chef d'orchestre côté client
   · Smooth scroll (Lenis) synchronisé avec GSAP ScrollTrigger
   · Système de révélations génériques [data-reveal]
   · Respecte prefers-reduced-motion (scroll natif, contenus visibles)
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

export default function Experience({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const html = document.documentElement;

    if (!reduced) {
      html.classList.add("gsap");

      /* ------------------------------------------------ Lenis + GSAP */
      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        anchors: { offset: -70 },
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      /* ----------------------------------------------- reveals génériques */
      const revealScan = () => {
        const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-revealed])");
        let aboveFold = 0;
        targets.forEach((el) => {
          el.dataset.revealed = "1";
          /* Déjà visible (pages sans hero plein écran, contenu re-rendu) :
             entrée en cascade, pas de scrub — il n'y a pas de scroll à jouer. */
          if (el.getBoundingClientRect().top < window.innerHeight * 0.98) {
            gsap.to(el, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.9,
              delay: 0.15 + 0.07 * aboveFold++,
              ease: "power3.out",
            });
            return;
          }
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "clamp(top 94%)",
              end: "clamp(top 72%)",
              scrub: 0.5,
            },
          });
        });
      };
      revealScan();

      /* Recalibrage une fois les fonts chargées (hauteurs stables) */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((st) => st.kill());
        html.classList.remove("gsap");
      };
    }
  }, []);

  return <>{children}</>;
}
