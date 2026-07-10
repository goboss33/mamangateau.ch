"use client";

/* ---------------------------------------------------------------------------
   Rencontre — le fond s'assombrit, place à Annie
   Section chocolat : l'écrin de la future vidéo interview (placeholder
   soigné en attendant le tournage). La poussière de sucre s'intensifie
   ici (événement "mg:dust") — l'effet "grains dans la lumière".
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

export default function Rencontre() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => window.dispatchEvent(new CustomEvent("mg:dust", { detail: 1.9 })),
      onEnterBack: () => window.dispatchEvent(new CustomEvent("mg:dust", { detail: 1.9 })),
      onLeave: () => window.dispatchEvent(new CustomEvent("mg:dust", { detail: 0.5 })),
      onLeaveBack: () => window.dispatchEvent(new CustomEvent("mg:dust", { detail: 0.5 })),
    });

    const tween = gsap.fromTo(
      frameRef.current,
      { scale: 0.88, y: 40 },
      {
        scale: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "center center",
          scrub: 0.5,
        },
      }
    );

    return () => {
      st.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="rencontre"
      ref={sectionRef}
      className="relative overflow-hidden bg-chocolate py-24 md:py-32"
    >
      {/* Halo de lumière au centre */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,75,0.16) 0%, rgba(201,162,75,0.05) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p data-reveal className="eyebrow mb-4">La rencontre</p>
        <h2 data-reveal className="section-title !text-vanilla">
          Annie, de vive voix
        </h2>
        <p data-reveal className="script-accent mt-2 text-3xl md:text-4xl">
          bientôt ici
        </p>

        {/* Écrin vidéo */}
        <div
          ref={frameRef}
          data-reveal="scale"
          className="gilded group relative mx-auto mt-12 aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-chocolate-deep md:mt-16"
        >
          <Image
            src="/images/rencontre-poster.webp"
            alt="L'atelier de Maman Gâteau"
            fill
            sizes="(max-width: 768px) 92vw, 768px"
            className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate-deep/70 via-transparent to-transparent" />

          {/* Bouton lecture (désactivé tant que la vidéo n'existe pas) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-vanilla/60 bg-vanilla/10 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 md:h-20 md:w-20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="#FDFBF7" />
              </svg>
            </span>
            <span className="rounded-full border border-gold/40 bg-chocolate/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold-soft backdrop-blur-sm">
              Interview en tournage
            </span>
          </div>
        </div>

        <p data-reveal className="mx-auto mt-10 max-w-xl leading-relaxed text-vanilla/70">
          Une interview face caméra est en préparation : Annie vous racontera son parcours,
          son atelier et ce qui se joue vraiment quand on lui confie votre fête. En
          attendant, son histoire est juste au-dessus — et ses créations, juste en dessous.
        </p>
      </div>
    </section>
  );
}
