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

export default function Temoignages({ google }: { google?: { rating: string; count: number; url: string } }) {
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
            Publiés sur Google par de vraies clientes — vérifiables en un clic.
          </p>
          {google && (
            <a
              data-reveal
              href={google.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-chocolate/10 bg-vanilla px-5 py-2.5 shadow-[0_12px_28px_-18px_rgba(74,44,32,0.45)] transition-transform duration-300 hover:scale-[1.04]"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span className="text-[15px] font-semibold text-chocolate">
                <span className="text-gold">★</span> {google.rating}
              </span>
              <span className="text-[13px] text-grey-studio">· {google.count} avis Google</span>
            </a>
          )}
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
          {google ? (
            <>
              <a href={google.url} target="_blank" rel="noopener noreferrer" className="underline decoration-gold/50 underline-offset-4 transition-colors hover:text-chocolate">
                Lire tous les avis sur Google
              </a>
              {" "}· d'autres mots doux chaque semaine sur Instagram ♥
            </>
          ) : (
            "D'autres mots doux chaque semaine sur Instagram ♥"
          )}
        </p>
      </div>
    </section>
  );
}
