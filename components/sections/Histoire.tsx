"use client";

/* ---------------------------------------------------------------------------
   Histoire — la timeline d'Annie en 5 temps
   Un fil d'or se dessine au fil du scroll et relie les étapes, du Pérou
   jusqu'à Maman Gâteau. Fond crème dans la continuité exacte du hero.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { TIMELINE, type Milestone } from "@/lib/data";

function MilestoneIcon({ icon }: { icon: Milestone["icon"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden className="text-gold">
      {icon === "toque" && (
        <g {...common}>
          <path d="M6.5 11.2a3.6 3.6 0 0 1-.4-7.15 4.4 4.4 0 0 1 5.9-2 4.4 4.4 0 0 1 5.9 2 3.6 3.6 0 0 1-.4 7.15" />
          <path d="M6.5 11v6.5h11V11" />
          <path d="M6.5 20h11" />
          <path d="M10 13.5v2.5M14 13.5v2.5" />
        </g>
      )}
      {icon === "hotel" && (
        <g {...common}>
          <path d="M4 20V6.5L12 3l8 3.5V20" />
          <path d="M2.5 20h19" />
          <path d="M8.5 9h1.5M14 9h1.5M8.5 12.5h1.5M14 12.5h1.5M10.5 20v-3.5h3V20" />
        </g>
      )}
      {icon === "star" && (
        <g {...common}>
          <path d="M12 3.2 14.6 8.5l5.8.85-4.2 4.1 1 5.8L12 16.5l-5.2 2.75 1-5.8-4.2-4.1 5.8-.85L12 3.2Z" />
        </g>
      )}
      {icon === "heart" && (
        <g {...common}>
          <path d="M12 20.2S4 15 4 9.6C4 6.9 6.1 5 8.4 5c1.5 0 2.9.8 3.6 2 .7-1.2 2.1-2 3.6-2C17.9 5 20 6.9 20 9.6c0 5.4-8 10.6-8 10.6Z" />
        </g>
      )}
      {icon === "cake" && (
        <g {...common}>
          <path d="M5 20v-6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2V20" />
          <path d="M3.5 20h17" />
          <path d="M5 15.2c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" />
          <path d="M12 11.5V9M12 9a1.5 1.5 0 0 0 1.5-1.5C13.5 6 12 4.5 12 4.5S10.5 6 10.5 7.5A1.5 1.5 0 0 0 12 9Z" />
        </g>
      )}
    </svg>
  );
}

export default function Histoire() {
  const sectionRef = useRef<HTMLElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const thread = threadRef.current!;
    gsap.set(thread, { scaleY: 0, transformOrigin: "top center" });
    const tween = gsap.to(thread, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 62%",
        end: "bottom 78%",
        scrub: 0.4,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="histoire" ref={sectionRef} className="relative bg-cream pb-28 pt-24 md:pb-36 md:pt-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* En-tête */}
        <div className="mb-16 max-w-2xl md:mb-24">
          <p data-reveal className="eyebrow mb-4">L'histoire</p>
          <h2 data-reveal className="section-title">
            Une cheffe devenue
            <span className="script-accent block pt-2 text-[clamp(2.6rem,7vw,4.8rem)]">
              maman gâteau
            </span>
          </h2>
          <p data-reveal className="mt-6 max-w-xl leading-relaxed text-cocoa">
            Derrière chaque création, dix ans de cuisine exigeante — et une petite fille
            qui a tout changé.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Fil d'or */}
          <div className="absolute bottom-4 left-[13px] top-2 w-px bg-gold/15 md:left-1/2" aria-hidden>
            <div ref={threadRef} className="h-full w-full bg-gradient-to-b from-gold-soft via-gold to-gold" />
          </div>

          <ol className="space-y-14 md:space-y-20">
            {TIMELINE.map((m, i) => {
              const left = i % 2 === 0; // desktop : alternance
              return (
                <li key={m.years} className="relative">
                  {/* Pastille sur le fil */}
                  <span
                    data-reveal="scale"
                    className="absolute left-0 top-1 flex h-[27px] w-[27px] items-center justify-center rounded-full border border-gold/50 bg-vanilla shadow-[0_4px_14px_-6px_rgba(201,162,75,0.6)] md:left-1/2 md:-translate-x-1/2"
                    aria-hidden
                  >
                    <span className="h-2 w-2 rounded-full bg-gold" />
                  </span>

                  <article
                    data-reveal={left ? "left" : "right"}
                    className={`ml-12 max-w-md md:ml-0 md:w-[calc(50%-3.5rem)] ${
                      left ? "md:mr-auto md:text-right" : "md:ml-auto"
                    }`}
                  >
                    <div className={`mb-3 flex items-center gap-3 ${left ? "md:flex-row-reverse" : ""}`}>
                      <MilestoneIcon icon={m.icon} />
                      <span className="font-display text-sm tracking-[0.18em] text-gold">
                        {m.years}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl text-chocolate md:text-[1.7rem]">
                      {m.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-cocoa">{m.text}</p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
