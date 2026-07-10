/* ---------------------------------------------------------------------------
   Marquee — bandeau défilant entre deux sections.
   Texte en contour, séparé d'étoiles dorées. Pure CSS (voir globals.css).
--------------------------------------------------------------------------- */

export default function Marquee({ items }: { items: readonly string[] }) {
  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className="font-display text-outline whitespace-nowrap px-6 text-[clamp(2.6rem,7vw,5rem)] leading-none"
          >
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
    <div className="relative overflow-hidden bg-vanilla py-8 md:py-10" aria-hidden>
      <div className="marquee-track">
        <div className="flex items-center">{row}</div>
        <div className="flex items-center">{row}</div>
      </div>
    </div>
  );
}
