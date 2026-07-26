/* Dernières pages du Journal sur la home — invisible tant que rien n'est publié. */
import Link from "next/link";
import Image from "next/image";
import { journalList, CATEGORY_LABEL, JOURNAL_SEGMENT } from "@/lib/journal";

export default async function JournalTeaser() {
  const entries = (await journalList()).slice(0, 3);
  if (entries.length === 0) return null;
  return (
    <section className="bg-cream py-20 md:py-28" id="journal">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <p data-reveal className="eyebrow mb-4">Sorti de l'atelier</p>
          <h2 data-reveal className="section-title">
            Les dernières histoires
            <span className="script-accent mt-2 block text-[clamp(2.4rem,6vw,4rem)]">fraîchement racontées</span>
          </h2>
        </div>
        {/* Mobile : la grille bento du Journal (une grande, deux petites, titres
            en surimpression). En colonne unique, le format portrait donnait
            428 px d'image par article — 1668 px pour trois, soit deux écrans de
            défilement. Ici, 602 px, et les trois restent visibles.
            Au-delà de sm, la mise en page à trois colonnes ne change pas. */}
        <div className="grid auto-rows-[190px] grid-cols-2 gap-4 sm:auto-rows-auto sm:grid-cols-3 sm:gap-6">
          {entries.map((e, i) => (
            <Link
              key={e.slug}
              href={`/${JOURNAL_SEGMENT}/${e.slug}`}
              data-reveal
              className={`group relative overflow-hidden rounded-3xl border border-chocolate/10 bg-cream transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(74,44,32,0.35)] sm:col-span-1 sm:row-span-1 sm:bg-vanilla ${
                // Une seule brève publiée en plus de la vedette : elle prend
                // toute la largeur plutôt que de laisser une case vide.
                i === 0 ? "col-span-2 row-span-2" : entries.length === 2 ? "col-span-2" : ""
              }`}
            >
              {e.cover ? (
                <div className="absolute inset-0 overflow-hidden sm:relative sm:aspect-[4/5]">
                  <Image
                    src={e.cover.src}
                    alt={e.cover.alt}
                    fill
                    sizes={i === 0 ? "(max-width: 640px) 92vw, 33vw" : "(max-width: 640px) 46vw, 33vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl sm:relative sm:aspect-[4/5]" aria-hidden>
                  📖
                </div>
              )}
              {/* Surimpression sur mobile (le dégradé porte la lisibilité),
                  bloc de texte classique sur desktop. */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-chocolate/85 via-chocolate/45 to-transparent px-4 pb-3.5 pt-10 sm:static sm:bg-none sm:px-6 sm:py-5">
                <p className="eyebrow mb-1 !text-[10px] !text-vanilla/75 sm:mb-2 sm:!text-[11px] sm:!text-gold">
                  {CATEGORY_LABEL[e.category]}
                </p>
                <h3
                  className={`font-display leading-snug text-vanilla sm:!text-xl sm:text-chocolate ${
                    i === 0 ? "text-xl" : "text-[15px]"
                  }`}
                >
                  {e.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <div data-reveal className="mt-10 text-center">
          <Link href={`/${JOURNAL_SEGMENT}`} className="inline-flex items-center justify-center rounded-full border border-chocolate/25 px-8 py-3.5 text-[14px] font-semibold text-chocolate transition-colors hover:bg-chocolate hover:text-vanilla">
            Toutes les histoires de l'atelier →
          </Link>
        </div>
      </div>
    </section>
  );
}
