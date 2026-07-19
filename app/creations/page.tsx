import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { SectionHead, JsonLd, breadcrumbJsonLd } from "@/components/pages/blocks";
import { journalList, CATEGORY_LABEL, JOURNAL_SEGMENT, type JournalCategory } from "@/lib/journal";

export const revalidate = 3600; // + rafraîchi immédiatement par le webhook Carnet

export const metadata: Metadata = {
  title: "Le journal des créations — gâteaux sur mesure | Maman Gâteau",
  description:
    "Les dernières créations sorties de l'atelier de Pully : gâteaux d'anniversaire, wedding cakes, cupcakes — et les conseils d'Annie pour bien choisir le vôtre. Lausanne & Riviera vaudoise.",
  alternates: { canonical: `/${JOURNAL_SEGMENT}` },
  openGraph: {
    title: "Le journal des créations | Maman Gâteau",
    description: "Chaque gâteau a son histoire — découvrez les dernières sorties de l'atelier.",
    url: `/${JOURNAL_SEGMENT}`,
  },
};

const CATS = Object.entries(CATEGORY_LABEL) as [JournalCategory, string][];

export default async function Page({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const active = CATS.some(([id]) => id === cat) ? (cat as JournalCategory) : null;
  const all = await journalList();
  const entries = active ? all.filter((e) => e.category === active) : all;

  return (
    <PageShell>
      <JsonLd data={[breadcrumbJsonLd("Le journal des créations", `/${JOURNAL_SEGMENT}`)]} />

      <section className="bg-cream pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p data-reveal className="eyebrow mb-4">Sorti de l'atelier</p>
          <h1 data-reveal className="section-title mx-auto max-w-3xl">
            Le journal des créations
            <span className="script-accent mt-2 block text-[clamp(2.6rem,7vw,4.6rem)]">chaque gâteau a son histoire</span>
          </h1>
          <p data-reveal className="mx-auto mt-6 max-w-2xl leading-relaxed text-cocoa">
            Les dernières créations sur mesure sorties de l'atelier de Pully — et les conseils
            d'Annie pour imaginer le vôtre. De vrais gâteaux, de vraies fêtes, de vraies histoires.
          </p>
        </div>
      </section>

      <section className="bg-vanilla py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          {/* filtres */}
          <div data-reveal className="mb-10 flex flex-wrap justify-center gap-2">
            <Link
              href={`/${JOURNAL_SEGMENT}`}
              className={`rounded-full border px-5 py-2 text-[13px] font-semibold transition-colors ${!active ? "border-chocolate bg-chocolate text-vanilla" : "border-chocolate/20 text-chocolate hover:border-chocolate/50"}`}
            >
              Tout
            </Link>
            {CATS.map(([id, label]) => (
              <Link
                key={id}
                href={`/${JOURNAL_SEGMENT}?cat=${id}`}
                className={`rounded-full border px-5 py-2 text-[13px] font-semibold transition-colors ${active === id ? "border-chocolate bg-chocolate text-vanilla" : "border-chocolate/20 text-chocolate hover:border-chocolate/50"}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {entries.length === 0 ? (
            <p data-reveal className="py-16 text-center leading-relaxed text-cocoa">
              Les premières histoires arrivent tout bientôt — l'atelier n'arrête jamais longtemps.
              <br />
              <Link href="/#configurateur" className="mt-2 inline-block font-semibold text-chocolate underline">
                En attendant, composez votre gâteau
              </Link>
            </p>
          ) : (
            <div className="grid auto-rows-[190px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4 md:gap-5">
              {entries.map((e, i) => {
                /* motif bento (cycle de 6) : grande · deux petites · verticale · deux petites */
                const m = i % 6;
                const span =
                  m === 0 ? "col-span-2 row-span-2" :
                  m === 3 ? "row-span-2" : "";
                const big = m === 0;
                return (
                  <Link
                    key={e.slug}
                    href={`/${JOURNAL_SEGMENT}/${e.slug}`}
                    className={`group relative overflow-hidden rounded-3xl border border-chocolate/10 bg-vanilla transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(74,44,32,0.45)] ${span}`}
                  >
                    {e.cover ? (
                      <Image
                        src={e.cover.src}
                        alt={e.cover.alt}
                        fill
                        sizes={big ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl" aria-hidden>📖</div>
                    )}
                    {e.format === "VIDEO" && (
                      <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-chocolate/75 text-vanilla backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 size-4"><path d="M8 5.5v13l11-6.5z" /></svg>
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-chocolate/85 via-chocolate/45 to-transparent px-4 pb-3.5 pt-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-vanilla/75">
                        {CATEGORY_LABEL[e.category]}{e.type === "ARTICLE" ? " · conseil" : ""}
                      </p>
                      <h2 className={`font-display leading-snug text-vanilla ${big ? "text-xl md:text-2xl" : "text-[15px] md:text-base"}`}>
                        {e.title}
                      </h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHead
            eyebrow="À votre tour"
            title="Et si la prochaine histoire"
            script="était la vôtre ?"
            lead="Composez votre gâteau en ligne — thème, parts, saveurs — et recevez votre devis. C'est gratuit et sans engagement."
          />
          <Link
            href="/#configurateur"
            data-reveal
            className="inline-flex items-center justify-center rounded-full bg-chocolate px-10 py-4 text-[15px] font-semibold text-vanilla shadow-[0_18px_38px_-18px_rgba(74,44,32,0.55)] transition-transform duration-300 hover:scale-[1.04]"
          >
            Composer mon gâteau
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
