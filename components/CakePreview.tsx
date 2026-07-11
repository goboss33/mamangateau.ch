"use client";

/* ---------------------------------------------------------------------------
   CakePreview — le gâteau qui se construit sous vos yeux
   Illustration SVG stylisée (esprit du logo) qui réagit aux choix :
   nombre d'étages, style (couleurs/décor), bougies + prénom si anniversaire.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const PALETTES: Record<string, { icing: string; band: string; accent: string }> = {
  floral: { icing: "#F6C9D4", band: "#FDFBF7", accent: "#D9534F" },
  kawaii: { icing: "#F7EFE3", band: "#F6C9D4", accent: "#4A2C20" },
  minimal: { icing: "#FDFBF7", band: "#F7EFE3", accent: "#C9A24B" },
  drip: { icing: "#F7EFE3", band: "#4A2C20", accent: "#4A2C20" },
  "semi-naked": { icing: "#F1E3CE", band: "#E4C9A6", accent: "#B7DDC2" },
  theme: { icing: "#F6C9D4", band: "#8FD0CF", accent: "#C9A24B" },
  default: { icing: "#F6C9D4", band: "#FDFBF7", accent: "#C9A24B" },
};

export default function CakePreview({
  tiers,
  styleId,
  isBirthday,
  celebrant,
  className = "",
}: {
  tiers: 1 | 2;
  styleId: string | null;
  isBirthday: boolean;
  celebrant?: string;
  className?: string;
}) {
  const tier2Ref = useRef<SVGGElement>(null);
  const prevTiers = useRef(tiers);

  const pal = PALETTES[styleId ?? "default"] ?? PALETTES.default;

  /* Pop du 2e étage quand il apparaît */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (tiers === 2 && prevTiers.current === 1 && tier2Ref.current) {
      gsap.fromTo(
        tier2Ref.current,
        { scale: 0, transformOrigin: "50% 100%" },
        { scale: 1, duration: 0.6, ease: "back.out(2.2)" }
      );
    }
    prevTiers.current = tiers;
  }, [tiers]);

  const name = (celebrant ?? "").trim().slice(0, 14);

  return (
    <svg
      viewBox="0 0 200 158"
      className={className}
      role="img"
      aria-label={`Aperçu : gâteau ${tiers} étage${tiers > 1 ? "s" : ""}`}
    >
      {/* assiette */}
      <ellipse cx="100" cy="136" rx="64" ry="8" fill="#C9A24B" opacity="0.9" />
      <ellipse cx="100" cy="133" rx="64" ry="8" fill="#DBBF7E" />

      {/* étage 1 */}
      <g style={{ transition: "all .4s" }}>
        <rect x="48" y="92" width="104" height="42" rx="7" fill={pal.icing} />
        <rect x="48" y="92" width="104" height="14" rx="7" fill={pal.band} />
        {/* petites perles */}
        {[62, 82, 102, 122, 142].map((x) => (
          <circle key={x} cx={x} cy="112" r="2.1" fill={pal.accent} opacity="0.55" />
        ))}
      </g>

      {/* étage 2 */}
      <g ref={tier2Ref} style={{ display: tiers === 2 ? undefined : "none" }}>
        <rect x="66" y="58" width="68" height="36" rx="6" fill={pal.icing} />
        <rect x="66" y="58" width="68" height="12" rx="6" fill={pal.band} />
        {[80, 100, 120].map((x) => (
          <circle key={x} cx={x} cy="76" r="1.9" fill={pal.accent} opacity="0.55" />
        ))}
      </g>

      {/* décor par style */}
      {styleId === "drip" && (
        <g fill="#4A2C20">
          {(tiers === 2 ? [70, 84, 98, 112, 126] : [56, 74, 92, 110, 128, 144]).map((x, i) => (
            <path
              key={x}
              d={`M${x} ${tiers === 2 ? 58 : 92} q2 ${8 + (i % 3) * 5} 0 ${10 + (i % 3) * 6} q-2 4 -4 0 q-1.6 -4 -1.6 -${8 + (i % 3) * 5} z`}
              opacity="0.85"
            />
          ))}
        </g>
      )}
      {styleId === "floral" && (
        <g>
          {(tiers === 2 ? [[70, 56], [130, 56], [54, 90], [146, 90]] : [[54, 90], [100, 88], [146, 90]]).map(
            ([x, y]) => (
              <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse
                    key={a}
                    cx="0"
                    cy="-4.2"
                    rx="2.6"
                    ry="4"
                    fill="#FDFBF7"
                    transform={`rotate(${a})`}
                  />
                ))}
                <circle r="2.4" fill="#C9A24B" />
              </g>
            )
          )}
        </g>
      )}
      {styleId === "kawaii" && (
        <g>
          <circle cx="88" cy={tiers === 2 ? 80 : 116} r="2.4" fill="#4A2C20" />
          <circle cx="112" cy={tiers === 2 ? 80 : 116} r="2.4" fill="#4A2C20" />
          <path
            d={`M94 ${tiers === 2 ? 86 : 122} q6 5 12 0`}
            stroke="#4A2C20"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="82" cy={tiers === 2 ? 85 : 121} r="3" fill="#F6C9D4" opacity="0.8" />
          <circle cx="118" cy={tiers === 2 ? 85 : 121} r="3" fill="#F6C9D4" opacity="0.8" />
        </g>
      )}

      {/* bougies si anniversaire, sinon petit topper étoile */}
      {isBirthday ? (
        <g>
          {(tiers === 2 ? [88, 100, 112] : [86, 100, 114]).map((x, i) => (
            <g key={x}>
              <rect
                x={x - 1.6}
                y={(tiers === 2 ? 58 : 92) - 14}
                width="3.2"
                height="13"
                rx="1.4"
                fill={["#D9534F", "#8FD0CF", "#C9A24B"][i]}
              />
              <ellipse
                cx={x}
                cy={(tiers === 2 ? 58 : 92) - 17}
                rx="2.2"
                ry="3.4"
                fill="#F4B84A"
              >
                <animate
                  attributeName="ry"
                  values="3.4;4.2;3.4"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </ellipse>
            </g>
          ))}
        </g>
      ) : (
        <path
          d={`M100 ${(tiers === 2 ? 58 : 92) - 16} l2.2 4.8 5.2.6 -3.9 3.6.9 5.2 -4.4-2.6 -4.4 2.6.9-5.2 -3.9-3.6 5.2-.6z`}
          fill="#C9A24B"
        />
      )}

      {/* prénom sous l'assiette, bien lisible */}
      {name && (
        <text
          x="100"
          y="152"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.06em"
          fill="#6B4A39"
          fontFamily="var(--font-quicksand), sans-serif"
        >
          {name}
        </text>
      )}
    </svg>
  );
}
