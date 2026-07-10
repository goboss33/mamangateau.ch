"use client";

/* ---------------------------------------------------------------------------
   Créations — galerie éditoriale parallax
   Vraies créations d'Annie. Trois colonnes qui respirent à des vitesses
   différentes (desktop), deux colonnes en mobile. Renvoi vers Instagram.
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
    if (window.innerWidth < 768) return; // parallax réservé au desktop
    const items = gridRef.current!.querySelectorAll<HTMLElement>("[data-speed]");
    const tweens: gsap.core.Tween[] = [];
    items.forEach((el) => {
      const speed = parseFloat(el.dataset.speed ?? "1");
      tweens.push(
        gsap.fromTo(
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
        )
      );
    });
    return () => tweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
  }, []);

  return (
    <section id="creations" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <p data-reveal className="eyebrow mb-4">Les créations</p>
            <h2 data-reveal className="section-title">
              Chaque gâteau est
              <span className="script-accent block pt-2 text-[clamp(2.4rem,6vw,4.4rem)]">
                une première fois
              </span>
            </h2>
          </div>
          <p data-reveal className="max-w-sm leading-relaxed text-cocoa">
            Pas de catalogue, pas de série : chaque pièce naît d'une conversation.
            En voici quelques-unes.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {PORTFOLIO.map((item, i) => (
            <figure
              key={item.src}
              data-reveal
              data-speed={item.speed}
              data-reveal-delay={String((i % 3) * 0.08)}
              className={`group relative overflow-hidden rounded-2xl bg-vanilla shadow-[0_18px_44px_-26px_rgba(74,44,32,0.4)] ${
                RATIO_CLASS[item.ratio]
              } ${i % 3 === 1 ? "md:mt-14" : ""}`}
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
        </div>
      </div>
    </section>
  );
}
