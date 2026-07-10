"use client";

/* ---------------------------------------------------------------------------
   Preloader — rideau d'ouverture
   Affiche le wordmark script + progression réelle du chargement des frames
   du hero (événements "mg:hero-progress"). Se retire en glissant vers le
   haut, comme un rideau de pâtisserie.
--------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      window.dispatchEvent(new CustomEvent("mg:ready"));
      return;
    }

    document.documentElement.style.overflow = "hidden";

    /* Entrée du wordmark */
    gsap.fromTo(
      wordRef.current,
      { opacity: 0, y: 24, rotate: -2 },
      { opacity: 1, y: 0, rotate: 0, duration: 1.1, ease: "power3.out" }
    );

    let displayed = 0;
    let target = 0;

    const tick = () => {
      displayed += (target - displayed) * 0.12;
      if (barRef.current) barRef.current.style.transform = `scaleX(${displayed / 100})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(displayed)}%`;
      if (displayed > 99.2 && target >= 100 && !doneRef.current) {
        doneRef.current = true;
        exit();
      }
    };
    gsap.ticker.add(tick);

    const onProgress = (e: Event) => {
      target = Math.max(target, Math.min(100, (e as CustomEvent<number>).detail));
    };
    window.addEventListener("mg:hero-progress", onProgress);

    /* Filet de sécurité : jamais plus de 6 s d'attente */
    const failsafe = setTimeout(() => (target = 100), 6000);

    const exit = () => {
      window.dispatchEvent(new CustomEvent("mg:ready"));
      gsap
        .timeline()
        .to(wordRef.current, { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" })
        .to(
          rootRef.current,
          {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: () => {
              document.documentElement.style.overflow = "";
              setGone(true);
            },
          },
          "-=0.15"
        );
    };

    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(failsafe);
      window.removeEventListener("mg:hero-progress", onProgress);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-cream"
      aria-hidden
    >
      <span
        ref={wordRef}
        className="font-script text-gold"
        style={{ fontSize: "clamp(2.6rem, 9vw, 5.5rem)" }}
      >
        Maman Gâteau
      </span>

      <div className="mt-10 h-px w-44 overflow-hidden bg-chocolate/10">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gold"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <span ref={pctRef} className="mt-3 text-xs font-semibold tracking-widest text-chocolate/50">
        0%
      </span>
    </div>
  );
}
