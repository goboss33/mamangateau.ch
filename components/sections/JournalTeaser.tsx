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
        <div className="grid gap-6 sm:grid-cols-3">
          {entries.map((e) => (
            <Link key={e.slug} href={`/${JOURNAL_SEGMENT}/${e.slug}`} data-reveal className="group overflow-hidden rounded-3xl border border-chocolate/10 bg-vanilla transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(74,44,32,0.35)]">
              {e.cover && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={e.cover.src} alt={e.cover.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
              )}
              <div className="px-6 py-5">
                <p className="eyebrow mb-2 !text-[11px]">{CATEGORY_LABEL[e.category]}</p>
                <h3 className="font-display text-xl leading-snug text-chocolate">{e.title}</h3>
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
