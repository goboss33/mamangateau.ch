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
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      targets.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? "0");
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.15,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

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
