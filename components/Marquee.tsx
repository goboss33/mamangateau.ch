/* ---------------------------------------------------------------------------
   Marquee — couture diagonale entre deux sections.
   Bande inclinée qui chevauche la section précédente et la suivante,
   texte en contour séparé d'étoiles dorées. Pure CSS (voir globals.css).
--------------------------------------------------------------------------- */

export default function Marquee({ items }: { items: readonly string[] }) {
  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display text-outline whitespace-nowrap px-6 text-[clamp(2.6rem,7vw,5rem)] leading-none">
            {item}
          </span>
          <svg width="22" height="22" viewBox="0 0 24 24" className="shrink-0 text-gold" aria-hidden>
            <path
              d="M12 2c.7 4.5 2.3 7.2 3.4 8.4 1.2 1.2 3.9 2.7 8.6 3.6-4.7.9-7.4 2.4-8.6 3.6-1.1 1.2-2.7 3.9-3.4 8.4-.7-4.5-2.3-7.2-3.4-8.4C7.4 16.4 4.7 14.9 0 14c4.7-.9 7.4-2.4 8.6-3.6C9.7 9.2 11.3 6.5 12 2Z"
              fill="currentColor"
            />
          </svg>
        </span>
      ))}
    </>
  );

  return (
    <div className="relative z-20 -my-10 overflow-x-clip md:-my-14" aria-hidden>
      <div className="-rotate-2 scale-x-110 overflow-hidden border-y border-gold/20 bg-vanilla py-6 shadow-[0_18px_50px_-32px_rgba(74,44,32,0.4)] md:py-8">
        <div className="marquee-track">
          <div className="flex items-center">{row}</div>
          <div className="flex items-center">{row}</div>
        </div>
      </div>
    </div>
  );
}
