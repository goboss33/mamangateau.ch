"use client";

/* ---------------------------------------------------------------------------
   Hero — « du topper au gâteau »
   Séquence d'images 16:9 peinte sur <canvas>, pilotée par le scroll
   (technique Apple) : dézoom du wordmark doré jusqu'au gâteau entier.

   Cadrage intelligent en portrait : au départ la frame est ajustée à la
   largeur (topper visible en entier) sur un fond ambiant flouté issu de la
   frame elle-même ; pendant le dézoom, un zoom progressif resserre le cadre
   jusqu'au gâteau. Aucune frame dédiée mobile : un seul set, deux mises en
   scène.

   · Chargement par vagues (1re, dernière, puis densité croissante)
   · Le préloader écoute "mg:hero-progress" (progression du set critique)
   · prefers-reduced-motion → dernière frame statique, aucun pin
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const FRAME_COUNT = 96;
const DEZOOM_END = 0.78; // le dézoom occupe 78 % du pin, le titre prend le relais

const framePath = (i: number) => `/frames/desktop/frame_${String(i).padStart(3, "0")}.webp`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const posters = section.querySelectorAll<HTMLImageElement>("[data-poster]");

    if (reduced) {
      /* Version apaisée : gâteau entier + titre, pas d'animation */
      posters.forEach((p) => (p.src = "/frames/poster-last.webp"));
      canvas.style.display = "none";
      window.dispatchEvent(new CustomEvent("mg:hero-progress", { detail: 100 }));
      return;
    }

    const ctx = canvas.getContext("2d")!;

    const images: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
    const loaded: boolean[] = Array(FRAME_COUNT).fill(false);
    let disposed = false;

    /* ------------------------------------------------------ chargement */
    const critical = new Set<number>([0, FRAME_COUNT - 1]);
    for (let i = 0; i < FRAME_COUNT; i += 4) critical.add(i);
    let criticalLoaded = 0;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (loaded[i] || disposed) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.src = framePath(i);
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

    /* Deux passes de réduction pour l'ambiance floutée (portrait) */
    const ambA = document.createElement("canvas");
    ambA.width = 32; ambA.height = 18;
    const ambACtx = ambA.getContext("2d")!;
    const ambB = document.createElement("canvas");
    ambB.width = 128; ambB.height = 72;
    const ambBCtx = ambB.getContext("2d")!;

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
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const cover = Math.max(cw / iw, ch / ih);
      const portrait = ch / cw > 1.15;

      let s = cover;
      let oy = 0;

      ctx.clearRect(0, 0, cw, ch);

      if (portrait) {
        /* Progression du dézoom (0 → 1), adoucie */
        const raw = state.frame / (FRAME_COUNT - 1);
        const p = raw * raw * (3 - 2 * raw); // smoothstep

        const fitW = cw / iw;                       // topper entier
        const end = Math.min(cover, fitW * 2.05);   // gâteau mis en valeur
        s = fitW + (end - fitW) * p;
        oy = -ch * 0.14 * p;                        // remonte un peu le sujet

        /* Ambiance : la frame elle-même, très floutée, en fond */
        ambACtx.drawImage(img, 0, 0, ambA.width, ambA.height);
        ambBCtx.drawImage(ambA, 0, 0, ambB.width, ambB.height);
        const as = Math.max(cw / ambB.width, ch / ambB.height);
        ctx.drawImage(
          ambB,
          (cw - ambB.width * as) / 2,
          (ch - ambB.height * as) / 2,
          ambB.width * as,
          ambB.height * as
        );
      }

      const w = iw * s;
      const h = ih * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2 + oy, w, h);
      if (idx > 0) posters.forEach((p) => (p.style.opacity = "0"));
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
      className="relative h-svh overflow-hidden bg-[#e3dad3]"
    >
      {/* Posters LCP : ambiance floutée + première frame (contain en portrait) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-poster
        src="/frames/poster-first.webp"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl transition-opacity duration-300 md:hidden"
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-poster
        src="/frames/poster-first.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 md:object-cover"
        aria-hidden
      />
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />

      {/* Fondu vers la section suivante : aucune couture visible */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26rem] bg-gradient-to-b from-transparent via-cream/45 to-cream md:h-44 md:via-transparent" />

      {/* Titre & CTA — apparaissent en fin de dézoom, volontairement minimal */}
      <div
        ref={titleRef}
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 text-center md:inset-x-auto md:left-[6vw] md:top-1/2 md:max-w-lg md:-translate-y-1/2 md:px-0 md:pb-0 md:text-left"
      >
        <h1 data-hero-fade className="mb-5">
          <span className="font-script block text-[clamp(2.9rem,10vw,5.6rem)] leading-[1.05] text-chocolate">
            Créatrice
            <br />
            de souvenirs
          </span>
          <span className="sr-only">
            Maman Gâteau — gâteaux d'anniversaire, de mariage et d'événement sur mesure à
            Lausanne, Pully et sur la Riviera vaudoise.
          </span>
        </h1>
        <p data-hero-fade className="mx-auto mb-8 max-w-xs text-[15px] leading-relaxed text-chocolate/75 md:mx-0 md:max-w-sm md:text-base">
          Des gâteaux aussi beaux que délicieux, pour les moments qui comptent.
        </p>
        <div data-hero-fade className="flex flex-col items-center gap-5 md:flex-row md:justify-start">
          <a href="#configurateur" className="btn-primary">
            Composer mon gâteau
          </a>
          <a
            href="#creations"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-chocolate/70 transition-colors duration-300 hover:text-chocolate"
          >
            Voir ses créations
            <span className="relative top-px transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              →
            </span>
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
