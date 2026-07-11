"use client";

/* ---------------------------------------------------------------------------
   La différence — manifeste en 3 piliers
   Numéros fraise, surligneur blush qui balaie la ligne script du titre,
   filets d'or qui se dessinent entre les piliers. Tout est réversible.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { PILLARS } from "@/lib/data";

export default function Difference() {
  const sectionRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current!;
    const killers: (() => void)[] = [];

    /* Surligneur blush derrière la ligne script */
    const sweep = gsap.fromTo(
      highlightRef.current,
      { backgroundSize: "0% 42%" },
      {
        backgroundSize: "100% 42%",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: highlightRef.current,
          start: "clamp(top 84%)",
          end: "clamp(top 58%)",
          scrub: 0.5,
        },
      }
    );
    killers.push(() => {
      sweep.scrollTrigger?.kill();
      sweep.kill();
    });

    /* Filets d'or dessinés + numéros qui roulent */
    section.querySelectorAll<HTMLElement>("[data-rule]").forEach((rule) => {
      const t = gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rule,
            start: "clamp(top 92%)",
            end: "clamp(top 68%)",
            scrub: 0.5,
          },
        }
      );
      killers.push(() => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    });

    return () => killers.forEach((k) => k());
  }, []);

  return (
    <section id="difference" ref={sectionRef} className="bg-vanilla pb-32 pt-24 md:pb-40 md:pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 md:mb-20">
          <p data-reveal className="eyebrow mb-4">La différence</p>
          <h2 data-reveal className="section-title max-w-3xl">
            Beaucoup de gâteaux sont beaux.
            <span
              ref={highlightRef}
              className="script-accent block w-fit pt-2 text-[clamp(2.4rem,6vw,4.4rem)]"
              style={{
                backgroundImage: "linear-gradient(#f6c9d4, #f6c9d4)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "0% 42%",
                backgroundPosition: "0 72%",
                paddingRight: "0.35em",
              }}
            >
              les miens se dévorent
            </span>
          </h2>
        </div>

        <div>
          {PILLARS.map((p, i) => (
            <div key={p.title}>
              {i > 0 && (
                <div data-rule className="h-px origin-left bg-gold/30" aria-hidden />
              )}
              <article className="grid gap-6 py-12 md:grid-cols-12 md:items-baseline md:gap-10 md:py-16">
                <span
                  data-reveal
                  className="font-display text-5xl text-strawberry/75 md:col-span-2 md:text-6xl"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="md:col-span-5">
                  <h3 data-reveal className="font-display text-3xl leading-tight text-chocolate md:text-4xl">
                    {p.title}
                  </h3>
                  <p data-reveal className="script-accent mt-2 text-2xl md:text-[1.7rem]">
                    {p.script}
                  </p>
                </div>
                <p data-reveal className="leading-relaxed text-cocoa md:col-span-5">
                  {p.text}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
