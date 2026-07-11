"use client";

/* ---------------------------------------------------------------------------
   Hero — « du topper au gâteau », en autoplay
   Le dézoom (96 frames canvas, crop portrait dédié sur mobile) se joue tout
   seul en ~2,6 s dès la sortie du préloader : geste « marque → produit »
   préservé, mais AUCUN scroll-jacking — la page défile normalement dès la
   première seconde, et scroller pendant l'animation l'accélère jusqu'au
   reveal. Ensuite, le gâteau garde un léger parallax au scroll.

   · Chargement par vagues (1re, dernière, puis densité croissante)
   · Le préloader écoute "mg:hero-progress" et répond "mg:ready"
   · prefers-reduced-motion → dernière frame statique, rien ne bouge
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const FRAME_COUNT = 96;
const PLAY_DURATION = 2.6; // secondes de dézoom
const SKIP_SPEED = 3.6;    // accélération si l'utilisateur interagit

const framePath = (set: "desktop" | "mobile", i: number) =>
  `/frames/${set}/frame_${String(i).padStart(3, "0")}.webp`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
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
    const critical = new Set<number>([0, FRAME_COUNT - 1]);
    for (let i = 0; i < FRAME_COUNT; i += 4) critical.add(i);
    let criticalLoaded = 0;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (loaded[i] || disposed) return resolve();
        const img = new window.Image();
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

    /* ------------------------------------------------ timeline autoplay */
    const titleEls = titleRef.current!.querySelectorAll("[data-hero-fade]");
    gsap.set(titleEls, { autoAlpha: 0, y: 44 });
    gsap.set(cueRef.current, { autoAlpha: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(state, {
      frame: FRAME_COUNT - 1,
      duration: PLAY_DURATION,
      ease: "power2.inOut",
      onUpdate: draw,
    })
      .to(
        titleEls,
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out" },
        PLAY_DURATION - 0.55
      )
      .to(cueRef.current, { autoAlpha: 1, duration: 0.6 }, "-=0.3");

    /* Scroller ou toucher pendant l'animation → on accélère jusqu'au reveal */
    const skip = () => {
      if (tl.isActive()) tl.timeScale(SKIP_SPEED);
      removeSkip();
    };
    const skipEvents: (keyof WindowEventMap)[] = ["wheel", "touchmove", "keydown"];
    const removeSkip = () =>
      skipEvents.forEach((e) => window.removeEventListener(e, skip));
    skipEvents.forEach((e) => window.addEventListener(e, skip, { passive: true }));

    let started = false;
    const start = () => {
      if (started || disposed) return;
      started = true;
      /* Si on arrive déjà scrollé (restauration navigateur), pas de cinéma */
      if (window.scrollY > window.innerHeight * 0.4) tl.progress(1);
      tl.play();
    };
    const onReady = () => start();
    window.addEventListener("mg:ready", onReady);
    const failsafe = setTimeout(start, 7500);

    /* -------------------------------------------- micro-parallax média */
    const parallax = gsap.to(mediaRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    /* L'indice de scroll s'efface dès que l'on quitte le sommet */
    const cueFade = ScrollTrigger.create({
      start: 8,
      onEnter: () => gsap.to(cueRef.current, { autoAlpha: 0, duration: 0.3 }),
    });

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
      clearTimeout(failsafe);
      removeSkip();
      window.removeEventListener("mg:ready", onReady);
      window.removeEventListener("resize", onResize);
      parallax.scrollTrigger?.kill();
      parallax.kill();
      cueFade.kill();
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
      {/* Média (poster LCP + canvas) — seul ce calque prend le parallax */}
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
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
      </div>

      {/* Fondu vers la section suivante : aucune couture visible */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-b from-transparent via-cream/60 to-cream md:h-44 md:via-transparent" />

      {/* Titre & CTA — révélés en fin de dézoom */}
      <div
        ref={titleRef}
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 text-center md:inset-x-auto md:left-[6vw] md:top-1/2 md:max-w-xl md:-translate-y-1/2 md:px-0 md:pb-0 md:text-left"
      >
        <p data-hero-fade className="mb-3 hidden text-xs font-bold uppercase tracking-[0.3em] text-chocolate/80 md:block">
          Cake design sur mesure — Lausanne · Riviera
        </p>
        <h1
          data-hero-fade
          className="font-display mb-6 text-[clamp(1.9rem,6.6vw,3.5rem)] leading-[1.1] text-chocolate [text-shadow:0_1px_16px_rgba(253,251,247,0.95),0_0_36px_rgba(253,251,247,0.7)] md:[text-shadow:none]"
        >
          Des gâteaux aussi beaux{" "}
          <br className="max-md:hidden" />
          que délicieux.
          <span className="sr-only">
            Maman Gâteau, créatrice de souvenirs — gâteaux d'anniversaire, de mariage et
            d'événement sur mesure à Lausanne, Pully et sur la Riviera vaudoise.
          </span>
        </h1>
        <div data-hero-fade className="mb-7 flex flex-col items-center gap-5 md:flex-row md:justify-start">
          <a href="#configurateur" className="btn-primary">
            Devis gratuit
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
        <a
          data-hero-fade
          href="#temoignages"
          className="group inline-flex items-center gap-3 rounded-full bg-vanilla/55 py-1.5 pl-2 pr-4 backdrop-blur-[2px] transition-colors duration-300 hover:bg-vanilla/80"
        >
          <span className="flex -space-x-2.5">
            {["creation-01", "creation-03", "creation-07"].map((img) => (
              <Image
                key={img}
                src={`/images/portfolio/${img}.webp`}
                alt=""
                width={30}
                height={30}
                className="h-[30px] w-[30px] rounded-full border-2 border-vanilla object-cover"
              />
            ))}
          </span>
          <span className="flex flex-col items-start">
            <span className="text-[13px] leading-none tracking-[0.15em] text-gold" aria-hidden>
              ★★★★★
            </span>
            <span className="mt-1 text-xs font-semibold leading-none text-chocolate/70 transition-colors group-hover:text-chocolate">
              les mots doux de ses clients
            </span>
          </span>
        </a>
      </div>

      {/* Indice de scroll — apparaît après le reveal, s'efface au 1er scroll */}
      <div
        ref={cueRef}
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-chocolate/60 max-md:hidden"
      >
        <span className="block h-9 w-px overflow-hidden bg-chocolate/15">
          <span className="block h-3 w-px animate-[cue_1.6s_ease-in-out_infinite] bg-gold" />
        </span>
        <style>{`@keyframes cue { 0%{transform:translateY(-12px)} 60%,100%{transform:translateY(40px)} }`}</style>
      </div>
    </section>
  );
}
