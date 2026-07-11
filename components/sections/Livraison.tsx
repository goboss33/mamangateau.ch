"use client";

/* ---------------------------------------------------------------------------
   Zone de livraison — carte stylisée de l'arc lémanique
   Le lac en aqua tendre, les villes en épingles dorées, Pully (l'atelier)
   en fraise. Les épingles éclosent au scroll.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CITIES_PRIMARY, CITIES_SECONDARY } from "@/lib/data";

export default function Livraison() {
  const mapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const pins = mapRef.current!.querySelectorAll("[data-pin]");
    gsap.set(pins, { scale: 0, transformOrigin: "center bottom" });
    const tween = gsap.to(pins, {
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: "back.out(2.2)",
      scrollTrigger: {
        trigger: mapRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="livraison" className="bg-vanilla py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <p data-reveal className="eyebrow mb-4">Zone de livraison</p>
          <h2 data-reveal className="section-title">
            De l'atelier de Pully
            <span className="script-accent block pt-2 text-[clamp(2.4rem,6vw,4.2rem)]">
              à votre table
            </span>
          </h2>
          <p data-reveal className="mt-6 max-w-lg leading-relaxed text-cocoa">
            Livraison soignée (ou retrait à l'atelier) à Lausanne, Pully, Vevey,
            Montreux, Morges, Renens — et dans tout le Grand Lausanne.
          </p>

          <div data-reveal className="mt-8 flex flex-wrap gap-2">
            {CITIES_SECONDARY.map((c) => (
              <span
                key={c}
                className="rounded-full border border-chocolate/12 bg-cream/70 px-3.5 py-1.5 text-[13px] font-semibold text-cocoa"
              >
                {c}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-gold/50 px-3.5 py-1.5 text-[13px] font-semibold text-gold">
              + votre commune ?
            </span>
          </div>

          <p data-reveal className="mt-6 text-sm text-grey-studio">
            Vous êtes un peu plus loin ? Écrivez-moi — on trouve presque toujours une
            solution.
          </p>
        </div>

        {/* Carte stylisée */}
        <div data-reveal="scale" className="relative">
          <svg
            ref={mapRef}
            viewBox="0 0 100 78"
            className="w-full drop-shadow-[0_24px_40px_rgba(74,44,32,0.10)]"
            role="img"
            aria-label="Carte de la zone de livraison : arc lémanique de Morges à Montreux"
          >
            {/* Terre */}
            <rect x="0" y="0" width="100" height="78" rx="6" fill="#F7EFE3" />
            {/* Relief léger (Lavaux) */}
            <path
              d="M48 52c6-5 13-7 20-6l14 3v-8l-16-4c-8-1-14 2-18 6l-8 9h8Z"
              fill="#B7DDC2"
              opacity="0.28"
            />
            <path
              d="M4 30c8-3 16-3 22 0l10 5-6 5-12-4c-6-2-10-1-14 1v-7Z"
              fill="#B7DDC2"
              opacity="0.2"
            />
            {/* Lac Léman (arc nord-est) */}
            <path
              d="M-2 58c10-9 24-14 38-13 12 1 22 6 30 13 7 6 16 10 26 11l10 1v10H-2V58Z"
              fill="#8FD0CF"
              opacity="0.4"
            />
            <path
              d="M-2 58c10-9 24-14 38-13 12 1 22 6 30 13 7 6 16 10 26 11"
              fill="none"
              stroke="#C9A24B"
              strokeWidth="0.7"
              strokeDasharray="2.2 1.6"
              opacity="0.8"
            />
            <text x="30" y="70" fontSize="4.6" fill="#4A2C20" opacity="0.45" fontStyle="italic" fontFamily="serif">
              Lac Léman
            </text>

            {/* Épingles */}
            {CITIES_PRIMARY.map((c) => (
              <g key={c.name} data-pin transform={`translate(${c.x} ${c.y})`}>
                <ellipse cx="0" cy="0.6" rx="2.1" ry="0.8" fill="#4A2C20" opacity="0.15" />
                <path
                  d="M0 0C-2.6-3.4-3.9-5.6-3.9-7.8a3.9 3.9 0 1 1 7.8 0C3.9-5.6 2.6-3.4 0 0Z"
                  fill={c.home ? "#D9534F" : "#C9A24B"}
                />
                <circle cx="0" cy="-7.6" r="1.6" fill="#FDFBF7" />
                {c.home && <circle cx="0" cy="-7.6" r="0.8" fill="#D9534F" />}
                <text
                  x="0"
                  y="4.6"
                  textAnchor="middle"
                  fontSize="3.6"
                  fontWeight="700"
                  fill="#4A2C20"
                  fontFamily="var(--font-quicksand), sans-serif"
                >
                  {c.name}
                </text>
                {c.home && (
                  <text
                    x="0"
                    y="8.2"
                    textAnchor="middle"
                    fontSize="2.6"
                    fill="#D9534F"
                    fontWeight="600"
                    fontFamily="var(--font-quicksand), sans-serif"
                  >
                    l'atelier
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
