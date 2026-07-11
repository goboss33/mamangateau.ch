"use client";

/* ---------------------------------------------------------------------------
   Mots doux — les avis comme des notes scotchées au frigo de l'atelier.
   Chaque note « se pose » : elle arrive d'en bas, tourne un peu trop, puis
   se cale sur son inclinaison finale avec un léger rebond. Réversible.
   ⚠️ Contenus PLACEHOLDER (voir lib/data.ts) — à remplacer par de vrais avis.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { TESTIMONIALS } from "@/lib/data";

export default function Temoignages() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const notes = gridRef.current!.querySelectorAll<HTMLElement>("[data-note]");

    if (prefersReducedMotion()) {
      /* Inclinaison finale sans animation */
      notes.forEach((n) => gsap.set(n, { rotation: parseFloat(n.dataset.rotate ?? "0") }));
      return;
    }

    const killers: (() => void)[] = [];
    notes.forEach((note, i) => {
      const finalRotate = parseFloat(note.dataset.rotate ?? "0");
      const tl = gsap.fromTo(
        note,
        {
          y: 110,
          autoAlpha: 0,
          scale: 0.86,
          rotation: finalRotate * 3.2 + (i % 2 === 0 ? -4 : 4),
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          rotation: finalRotate,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: note,
            start: `clamp(top ${94 - (i % 2) * 4}%)`,
            end: `clamp(top ${64 - (i % 2) * 4}%)`,
            scrub: 0.55,
          },
        }
      );
      killers.push(() => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    });
    return () => killers.forEach((k) => k());
  }, []);

  return (
    <section id="temoignages" className="overflow-hidden bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center md:mb-24">
          <p data-reveal className="eyebrow mb-4">Ils en parlent mieux que moi</p>
          <h2 data-reveal className="section-title">
            <span className="script-accent block text-[clamp(3rem,9vw,5.4rem)]">
              Mots doux
            </span>
            <span className="sr-only">— les avis de nos clients</span>
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-md leading-relaxed text-cocoa">
            Reçus par message, gardés précieusement — comme les recettes qui marchent.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:px-10">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.author}
              data-note
              data-rotate={t.rotate}
              className={`love-note px-7 py-8 will-change-transform md:px-9 md:py-10 ${
                i % 2 === 1 ? "sm:translate-y-10" : ""
              }`}
              style={{ "--tape-rotate": `${-t.rotate * 1.4}deg` } as React.CSSProperties}
            >
              <svg width="26" height="20" viewBox="0 0 26 20" className="mb-4 text-blush" aria-hidden>
                <path
                  d="M11.2 0C6 3 2.4 7.4 2.4 13.2c0 4 2.5 6.8 5.8 6.8 3 0 5.2-2.2 5.2-5.1 0-2.8-2-4.8-4.7-4.8-.5 0-1 .1-1.3.2C8.2 7 10 4.4 13 2.2L11.2 0Zm13 0c-5.3 3-8.9 7.4-8.9 13.2 0 4 2.6 6.8 5.9 6.8 3 0 5.2-2.2 5.2-5.1 0-2.8-2-4.8-4.8-4.8-.5 0-.9.1-1.2.2.8-3.3 2.6-5.9 5.6-8.1L24.1 0Z"
                  fill="currentColor"
                />
              </svg>
              <blockquote className="text-[17px] leading-relaxed text-chocolate md:text-lg">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-baseline gap-2">
                <span className="font-script text-2xl text-gold">{t.author}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-grey-studio">
                  — {t.context}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p data-reveal className="mt-20 text-center text-sm text-grey-studio sm:mt-24">
          D'autres mots doux chaque semaine sur Instagram ♥
        </p>
      </div>
    </section>
  );
}
