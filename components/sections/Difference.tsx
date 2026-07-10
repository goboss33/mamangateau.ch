/* ---------------------------------------------------------------------------
   La différence — 3 piliers, traités comme un manifeste éditorial.
   Numérotation dorée, script en contrepoint, filets d'or.
--------------------------------------------------------------------------- */

import { PILLARS } from "@/lib/data";

export default function Difference() {
  return (
    <section id="difference" className="bg-vanilla py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 md:mb-20">
          <p data-reveal className="eyebrow mb-4">La différence</p>
          <h2 data-reveal className="section-title max-w-3xl">
            Beaucoup de gâteaux sont beaux.
            <span className="script-accent block pt-2 text-[clamp(2.4rem,6vw,4.4rem)]">
              les miens se dévorent
            </span>
          </h2>
        </div>

        <div>
          {PILLARS.map((p, i) => (
            <article
              key={p.title}
              className={`grid gap-6 py-12 md:grid-cols-12 md:items-baseline md:gap-10 md:py-16 ${
                i > 0 ? "border-t border-gold/20" : ""
              }`}
            >
              <span
                data-reveal
                className="font-display text-5xl text-gold/60 md:col-span-2 md:text-6xl"
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
          ))}
        </div>
      </div>
    </section>
  );
}
