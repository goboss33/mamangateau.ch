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

      /* ----------------------------------------------- reveals génériques
         Un IntersectionObserver déclenche une fois l'apparition, la transition
         CSS fait le reste (voir globals.css). L'ancienne version créait un
         ScrollTrigger « scrub » par élément — plus de cent tweens recalculés à
         chaque image de défilement, sur le même thread que le scroll. */
      const io = new IntersectionObserver(
        (entries) => {
          let rank = 0;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            // Cascade pour les éléments qui entrent ensemble (même écran).
            el.style.setProperty("--reveal-delay", `${rank++ * 70}ms`);
            el.dataset.revealed = "1";
            io.unobserve(el);
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.01 }
      );
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
        .forEach((el) => io.observe(el));

      /* Recalibrage une fois les fonts chargées (hauteurs stables) */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        io.disconnect();
        gsap.ticker.remove(raf);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((st) => st.kill());
        html.classList.remove("gsap");
      };
    }
  }, []);

  return <>{children}</>;
}
