import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { BISCUITS, MAX_FOURRAGES, waLink } from "@/lib/data";
import { getTarifs } from "@/lib/tarifs";
import { SectionHead, CtaBand, CrossLinks, JsonLd, breadcrumbJsonLd } from "@/components/pages/blocks";

/* ---------------------------------------------------------------------------
   /saveurs — la carte des parfums, à envoyer d'un lien plutôt qu'en pièce
   jointe : toujours à jour, jolie en aperçu WhatsApp/Instagram, et elle ramène
   au configurateur au lieu d'être un cul-de-sac.

   Le texte est rendu en HTML depuis les tarifs de Carnet (suppléments
   compris) : même si l'affiche imprimée vieillit, la page, elle, reste juste.
--------------------------------------------------------------------------- */

const CARD = "/images/saveurs-maman-gateau.jpeg";
/* Aperçu de lien à part : la carte est un portrait 1536×2752, format que
   WhatsApp et Facebook réduisent en vignette carrée illisible. Ils attendent
   du 1200×630 — d'où cette version paysage, où le titre reste lisible. */
const OG = "/images/og-saveurs.jpg";

export const revalidate = 300; // suit les tarifs réglés dans Carnet

export const metadata: Metadata = {
  title: "Saveurs : biscuits et fourrages | Maman Gâteau, Lausanne",
  description:
    "Tous les parfums de mes gâteaux sur mesure : 6 biscuits (vanille, chocolat, citron, cannelle, orange, nature) et 14 fourrages, des ganaches aux coulis de fruits. À composer dans le configurateur.",
  alternates: { canonical: "/saveurs" },
  openGraph: {
    title: "Les saveurs — Maman Gâteau",
    description: "Choisissez un biscuit et jusqu'à deux fourrages : ganaches, crèmes, coulis de fruits frais.",
    url: "/saveurs",
    images: [{ url: OG, width: 1200, height: 630, alt: "Carte des saveurs Maman Gâteau : 6 biscuits et 14 fourrages" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
};

const WA = waLink("Bonjour Annie ! J'ai vu votre carte des saveurs et j'aimerais un gâteau sur mesure.");

export default async function Saveurs() {
  const tarifs = await getTarifs();
  const supp = (sup: number) => (sup > 0 ? ` +${sup}` : "");

  return (
    <PageShell>
      <JsonLd data={[breadcrumbJsonLd("Saveurs", "/saveurs")]} />

      {/* En-tête sobre : la carte est la vedette, pas un hero de plus */}
      <header className="bg-vanilla pb-14 pt-28 md:pb-20 md:pt-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <nav data-reveal aria-label="Fil d'Ariane" className="eyebrow mb-5">
            <a href="/" className="transition-colors hover:text-chocolate">Accueil</a>
            <span className="mx-2 text-gold">·</span>
            <span>Saveurs</span>
          </nav>
          <h1 data-reveal className="font-display text-[clamp(2.4rem,6vw,3.6rem)] leading-[1.05] text-chocolate">
            Les saveurs
          </h1>
          <p data-reveal className="font-script mt-2 text-[clamp(2rem,5vw,3rem)] leading-none text-gold">
            de vos gâteaux
          </p>
          <p data-reveal className="mx-auto mt-6 max-w-xl leading-relaxed text-grey-studio">
            Choisissez une saveur pour le biscuit, puis une à {MAX_FOURRAGES === 2 ? "deux" : MAX_FOURRAGES} saveurs
            pour le fourrage intérieur. Tout le reste — la forme, le décor, le thème — se décide ensemble.
          </p>
        </div>
      </header>

      {/* Les listes, en vrai texte : lisibles sur mobile, indexables, à jour */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
            <div data-reveal>
              <p className="eyebrow mb-3">Le biscuit</p>
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.1rem)] leading-tight text-chocolate">
                Choisissez-en <span className="font-script text-gold">un seul</span>
              </h2>
              <ul className="mt-6 space-y-2.5">
                {BISCUITS.map((b) => (
                  <li key={b.id} className="flex items-baseline gap-3 border-b border-gold/20 pb-2.5 text-chocolate">
                    <span className="size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    {b.label}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal>
              <p className="eyebrow mb-3">Le fourrage</p>
              <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.1rem)] leading-tight text-chocolate">
                Une ou deux <span className="font-script text-gold">saveurs</span>
              </h2>
              <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {tarifs.fourrages.map((f) => (
                  <li key={f.id} className="flex items-baseline gap-3 border-b border-gold/20 pb-2.5 text-chocolate">
                    <span className="size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    <span className="min-w-0 flex-1">{f.label}</span>
                    {f.sup > 0 && (
                      <span className="shrink-0 text-[13px] font-medium text-gold" title="supplément par gâteau">
                        {supp(f.sup)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[13px] leading-relaxed text-grey-studio">
                Suppléments en CHF, par gâteau. Sans lactose sur demande — dites-le-moi, j'adapte la recette.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La carte imprimée — la même information, en version à garder */}
      <section className="bg-vanilla py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="À garder sous la main" title="La carte" script="des saveurs" />
          <figure data-reveal className="mx-auto mt-10 max-w-md">
            <a href={CARD} target="_blank" rel="noopener" className="block overflow-hidden rounded-3xl border border-gold/30 shadow-[0_30px_60px_-30px_rgba(74,44,32,0.45)] transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src={CARD}
                alt="Carte des saveurs Maman Gâteau : six biscuits et quatorze fourrages, des ganaches aux coulis de fruits"
                width={1536}
                height={2752}
                sizes="(min-width: 768px) 28rem, 100vw"
                className="h-auto w-full"
              />
            </a>
            <figcaption className="mt-4 text-center text-[13px] text-grey-studio">
              <a href={CARD} download className="underline decoration-gold/50 underline-offset-4 transition-colors hover:text-chocolate">
                Télécharger la carte
              </a>
              {" "}· à imprimer ou à garder dans votre téléphone
            </figcaption>
          </figure>
        </div>
      </section>

      <CtaBand
        script="Votre gâteau, son prix en 2 minutes"
        text="Les saveurs sont choisies ? Composez votre gâteau et découvrez son prix immédiatement — c'est gratuit et sans engagement."
        ctaLabel="Composer mon gâteau"
        ctaHref="/#configurateur"
        note="Ou écrivez-moi directement, je réponds personnellement sous 24 h."
      />

      <CrossLinks
        links={[
          { href: "/gateau-anniversaire-lausanne", label: "Gâteaux d'anniversaire", desc: "le thème de leurs rêves, dès CHF 100", img: "/images/cupcakes/cupcake-03.webp" },
          { href: "/gateau-mariage-lausanne", label: "Wedding cakes", desc: "la pièce maîtresse de votre réception", img: "/images/cupcakes/cupcake-01.webp" },
          { href: "/cupcakes-lausanne", label: "Cupcakes", desc: "en complément d'un gâteau, dès CHF 24", img: "/images/cupcakes/cupcake-02.webp" },
        ]}
      />

      <noscript>
        <a href={WA}>Écrire à Annie sur WhatsApp</a>
      </noscript>
    </PageShell>
  );
}
