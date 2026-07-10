"use client";

/* ---------------------------------------------------------------------------
   Hero — « du topper au gâteau »
   Séquence d'images peinte sur <canvas>, pilotée par le scroll (technique
   Apple) : dézoom du wordmark doré jusqu'au gâteau entier. Frame-accurate,
   identique sur mobile (crop portrait dédié) et desktop.

   · Chargement par vagues (1re, dernière, puis densité croissante)
   · Le préloader écoute "mg:hero-progress" (progression du set critique)
   · prefers-reduced-motion → dernière frame statique, aucun pin
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const FRAME_COUNT = 96;
const DEZOOM_END = 0.78; // le dézoom occupe 78 % du pin, le titre prend le relais

const framePath = (set: "desktop" | "mobile", i: number) =>
  `/frames/${set}/frame_${String(i).padStart(3, "0")}.webp`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;

    if (reduced) {
      /* Version apaisée : gâteau entier + titre, pas d'animation */
      if (posterRef.current) posterRef.current.src = "/frames/poster-last.webp";
      canvas.style.display = "none";
      window.dispatchEvent(new CustomEvent("mg:hero-progress", { detail: 100 }));
      return;
    }

    const ctx = canvas.getContext("2d")!;
    const isPortrait =
      window.matchMedia("(orientation: portrait)").matches || window.innerWidth < 768;
    const set: "desktop" | "mobile" = isPortrait ? "mobile" : "desktop";

    const images: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
    const loaded: boolean[] = Array(FRAME_COUNT).fill(false);
    let disposed = false;

    /* ------------------------------------------------------ chargement */
    // Set critique : assez de frames pour un scrub fluide immédiat.
    const critical = new Set<number>([0, FRAME_COUNT - 1]);
    for (let i = 0; i < FRAME_COUNT; i += 4) critical.add(i);
    let criticalLoaded = 0;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (loaded[i] || disposed) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.src = framePath(set, i);
        img.onload = () => {
          images[i] = img;
          loaded[i] = true;
          if (critical.has(i)) {
            criticalLoaded++;
            window.dispatchEvent(
              new CustomEvent("mg:hero-progress", {
                detail: (criticalLoaded / critical.size) * 100,
              })
            );
          }
          resolve();
        };
        img.onerror = () => resolve();
      });

    const loadWave = async (step: number) => {
      const jobs: Promise<void>[] = [];
      for (let i = 0; i < FRAME_COUNT; i += step) jobs.push(load(i));
      await Promise.all(jobs);
    };

    (async () => {
      await Promise.all([load(0), load(FRAME_COUNT - 1)]);
      draw();
      await loadWave(8);
      await loadWave(4); // ← fin du set critique
      draw();
      await loadWave(2);
      await loadWave(1);
      draw();
    })();

    /* ----------------------------------------------------------- dessin */
    const state = { frame: 0 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
    size();

    function nearestLoaded(target: number): number {
      if (loaded[target]) return target;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (loaded[target - d]) return target - d;
        if (loaded[target + d]) return target + d;
      }
      return 0;
    }

    function draw() {
      const idx = nearestLoaded(
        Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(state.frame)))
      );
      const img = images[idx];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      if (posterRef.current && idx > 0) posterRef.current.style.opacity = "0";
    }

    /* --------------------------------------------------------- timeline */
    const titleEls = titleRef.current!.querySelectorAll("[data-hero-fade]");
    gsap.set(titleEls, { autoAlpha: 0, y: 44 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(
      state,
      {
        frame: FRAME_COUNT - 1,
        duration: DEZOOM_END,
        ease: "none",
        onUpdate: draw,
      },
      0
    )
      .to(cueRef.current, { autoAlpha: 0, duration: 0.04 }, 0.01)
      .to(
        titleEls,
        { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.035, ease: "power2.out" },
        DEZOOM_END - 0.04
      );

    /* --------------------------------------------------------- resize */
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const onResize = () => {
      // Ignore les micro-variations de hauteur (barre d'adresse mobile)
      if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 130) return;
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      size();
      draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Maman Gâteau — créatrice de souvenirs"
      className="relative h-svh overflow-hidden bg-[#dbd2cc]"
    >
      {/* Poster LCP : première frame visible instantanément */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={posterRef}
        src="/frames/poster-first.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        aria-hidden
      />
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />

      {/* Fondu vers la section suivante : aucune couture visible */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-b from-transparent via-cream/60 to-cream md:h-44 md:via-transparent" />

      {/* Titre & CTAs — apparaissent en fin de dézoom */}
      <div
        ref={titleRef}
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 text-center md:inset-x-auto md:left-[6vw] md:top-1/2 md:max-w-lg md:-translate-y-1/2 md:px-0 md:pb-0 md:text-left"
      >
        <p data-hero-fade className="eyebrow mb-4">
          Cake design sur mesure — Pully · Lausanne · Riviera
        </p>
        <h1 data-hero-fade className="mb-4">
          <span className="font-script block text-[clamp(2.9rem,10vw,5.8rem)] leading-[1.05] text-chocolate [text-shadow:0_1px_18px_rgba(253,251,247,0.95),0_0_44px_rgba(253,251,247,0.75)] md:[text-shadow:none]">
            Créatrice
            <br />
            de souvenirs
          </span>
          <span className="sr-only">
            Maman Gâteau — gâteaux d'anniversaire, de mariage et d'événement sur mesure à
            Lausanne, Pully et sur la Riviera vaudoise.
          </span>
        </h1>
        <p data-hero-fade className="mx-auto mb-7 max-w-md text-[15px] leading-relaxed text-cocoa md:mx-0 md:text-base">
          Des gâteaux aussi beaux que délicieux, imaginés avec vous pour les moments qui
          comptent.
        </p>
        <div data-hero-fade className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <a href="#configurateur" className="btn-primary">
            Composer mon gâteau
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#creations" className="btn-ghost">
            Voir ses créations
          </a>
        </div>
      </div>

      {/* Indice de scroll */}
      <div
        ref={cueRef}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-chocolate/60"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
          Faites défiler
        </span>
        <span className="block h-9 w-px overflow-hidden bg-chocolate/15">
          <span className="block h-3 w-px animate-[cue_1.6s_ease-in-out_infinite] bg-gold" />
        </span>
        <style>{`@keyframes cue { 0%{transform:translateY(-12px)} 60%,100%{transform:translateY(40px)} }`}</style>
      </div>
    </section>
  );
}
