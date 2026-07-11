"use client";

/* ---------------------------------------------------------------------------
   Créations — galerie éditoriale
   Chaque visuel se révèle comme un rideau (clip-path) pendant que la photo
   dézoome à l'intérieur — réversible au scroll inverse. Les colonnes gardent
   des vitesses de parallax différentes sur desktop.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { PORTFOLIO, SITE } from "@/lib/data";

const RATIO_CLASS: Record<string, string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  tall: "aspect-[3/4]",
};

export default function Portfolio() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const killers: (() => void)[] = [];
    const figures = gridRef.current!.querySelectorAll<HTMLElement>("[data-curtain]");

    /* Révélation rideau + dézoom interne, réversible */
    figures.forEach((fig, i) => {
      const img = fig.querySelector("img");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: fig,
          start: `clamp(top ${96 - (i % 3) * 2}%)`,
          end: "clamp(top 62%)",
          scrub: 0.5,
        },
        defaults: { ease: "power2.out", duration: 1 },
      });
      tl.fromTo(
        fig,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)" },
        0
      ).fromTo(img, { scale: 1.32, yPercent: 8 }, { scale: 1, yPercent: 0 }, 0);
      killers.push(() => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    });

    /* Parallax par colonne (desktop) */
    if (window.innerWidth >= 768) {
      gridRef.current!.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed ?? "1");
        const t = gsap.fromTo(
          el,
          { y: (1 - speed) * -90 },
          {
            y: (1 - speed) * 90,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
        killers.push(() => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      });
    }

    return () => killers.forEach((k) => k());
  }, []);

  return (
    <section id="creations" className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <p data-reveal className="eyebrow mb-4">Les créations</p>
            <h2 data-reveal className="section-title">
              Chaque gâteau est
              <span className="script-accent block pt-2 text-[clamp(2.4rem,6vw,4.4rem)]">
                une première fois
              </span>
              <span className="sr-only">— nos créations de gâteaux personnalisés</span>
            </h2>
          </div>
          <p data-reveal className="max-w-sm leading-relaxed text-cocoa">
            Pas de catalogue, pas de série : chaque pièce naît d'une conversation.
            En voici quelques-unes.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {PORTFOLIO.map((item, i) => (
            <div key={item.src} data-speed={item.speed} className={i % 3 === 1 ? "md:mt-14" : ""}>
              <figure
                data-curtain
                className={`group relative overflow-hidden rounded-2xl bg-vanilla shadow-[0_18px_44px_-26px_rgba(74,44,32,0.4)] ${RATIO_CLASS[item.ratio]}`}
                style={{ clipPath: "inset(100% 0% 0% 0%)" }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 46vw, 30vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="rounded-full bg-vanilla/90 px-3 py-1.5 text-xs font-semibold text-chocolate backdrop-blur-sm">
                    {item.label}
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-14 flex flex-col items-center gap-4 text-center md:mt-20">
          <p className="script-accent text-3xl">la suite s'écrit chaque semaine…</p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
            </svg>
            Suivre {SITE.instagramHandle}
          </a>
          <nav
            aria-label="Créations par occasion"
            className="mt-2 flex flex-wrap items-center justify-center gap-2.5 text-sm"
          >
            {[
              ["/gateau-anniversaire-lausanne", "Gâteaux d'anniversaire"],
              ["/gateau-mariage-lausanne", "Gâteaux de mariage"],
              ["/cupcakes-lausanne", "Cupcakes"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-chocolate/15 bg-vanilla px-4 py-2 font-semibold text-cocoa transition-all duration-300 hover:border-gold hover:text-chocolate"
              >
                {label} →
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
