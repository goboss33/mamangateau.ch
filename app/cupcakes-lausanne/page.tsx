import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { SITE, waLink } from "@/lib/data";
import {
  LandingHero,
  SectionHead,
  Gallery,
  Faq,
  CtaBand,
  CrossLinks,
  JsonLd,
  faqJsonLd,
  breadcrumbJsonLd, serviceJsonLd,
  type FaqItem,
  type GalleryItem,
} from "@/components/pages/blocks";

export const metadata: Metadata = {
  title: "Cupcakes personnalisés à Lausanne — dès CHF 24 | Maman Gâteau",
  description:
    "Boîtes de cupcakes et mini-cupcakes personnalisés à Lausanne et Pully : 6 cupcakes CHF 24, 12 minis CHF 28. Thème au choix, parfaits seuls ou en complément d'un gâteau.",
  alternates: { canonical: "/cupcakes-lausanne" },
  openGraph: {
    title: "Cupcakes personnalisés à Lausanne | Maman Gâteau",
    description: "Boîtes de 6 cupcakes (CHF 24) ou 12 mini-cupcakes (CHF 28), décorés à votre thème.",
    url: "/cupcakes-lausanne",
    images: [{ url: "/images/og-cupcakes.jpg", width: 1200, height: 630, alt: "Cupcakes personnalisés — Maman Gâteau, Lausanne" }],
  },
};

const GALERIE: GalleryItem[] = [
  { src: "/images/cupcakes/cupcake-02.webp", alt: "Boîte de douze cupcakes personnalisés sur le thème Stitch, roses et bleus, pour un anniversaire de 8 ans", w: 1600, h: 1195 },
  { src: "/images/cupcakes/cupcake-01.webp", alt: "Cupcakes pandas au chocolat et à la vanille avec glaçage vert d'eau", w: 1195, h: 1600 },
  { src: "/images/cupcakes/cupcake-03.webp", alt: "Cupcakes ninjas colorés présentés sur un présentoir pour un goûter d'anniversaire", w: 1195, h: 1600 },
  { src: "/images/cupcakes/cupcake-04.webp", alt: "Boîte de douze mini-cupcakes personnalisés prêts à être livrés à Lausanne", w: 1195, h: 1600 },
];

const FAQ: FaqItem[] = [
  {
    q: "Quels parfums pour les cupcakes ?",
    a: "Les mêmes que mes gâteaux : biscuit vanille, chocolat, citron, cannelle ou orange, garni de ganache ou de crème au choix. En complément d'un gâteau, je les assortis à ses saveurs — ou je varie, pour que chacun trouve son préféré.",
  },
  {
    q: "Combien de temps à l'avance commander ?",
    a: "Une à deux semaines suffisent en général pour des cupcakes seuls. Commandés avec un gâteau, tout se prépare et se livre ensemble — comptez alors 2 à 3 semaines.",
  },
  {
    q: "Le décor est-il personnalisable ?",
    a: "Oui, entièrement : personnages, couleurs de votre fête, chiffre d'anniversaire, thème de votre événement… Envoyez-moi une photo d'inspiration et je m'occupe du reste.",
  },
  {
    q: "Livrez-vous les cupcakes ?",
    a: "Oui, aux mêmes conditions que les gâteaux : livraison offerte jusqu'à 10 km de Pully, puis CHF 1 par kilomètre. Retrait à l'atelier possible, à Pully.",
  },
];

const productsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Boîte de 6 cupcakes personnalisés",
    description: "Six cupcakes décorés à votre thème, biscuits et garnitures au choix. Lausanne, Pully & Riviera.",
    image: `${SITE.domain}/images/cupcakes/cupcake-01.webp`,
    brand: { "@type": "Brand", name: SITE.name },
    offers: { "@type": "Offer", price: "24", priceCurrency: "CHF", availability: "https://schema.org/InStock", url: `${SITE.domain}/cupcakes-lausanne` },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Boîte de 12 mini-cupcakes personnalisés",
    description: "Douze mini-cupcakes format bouchée, décorés à votre thème. Lausanne, Pully & Riviera.",
    image: `${SITE.domain}/images/cupcakes/cupcake-04.webp`,
    brand: { "@type": "Brand", name: SITE.name },
    offers: { "@type": "Offer", price: "28", priceCurrency: "CHF", availability: "https://schema.org/InStock", url: `${SITE.domain}/cupcakes-lausanne` },
  },
];

const WA_CUPCAKES = waLink(
  "Bonjour Annie ! J'aimerais commander des cupcakes personnalisés. 🧁"
);

export default function Page() {
  return (
    <PageShell>
      <JsonLd data={[faqJsonLd(FAQ), breadcrumbJsonLd("Cupcakes à Lausanne", "/cupcakes-lausanne"), ...productsJsonLd, serviceJsonLd("Cupcakes personnalisés", "Cupcakes personnalisés dès CHF 24, pour anniversaires, baby showers et événements d'entreprise — Lausanne et environs.", "/cupcakes-lausanne")]} />

      <LandingHero
        crumb="Cupcakes"
        title="Cupcakes personnalisés à Lausanne"
        script="la petite touche en plus"
        lead="Pandas, héros préférés, couleurs de votre fête : des cupcakes décorés un à un, aussi bons que mes gâteaux. En vedette d'un goûter, en sweet table de mariage ou en complément du gâteau d'anniversaire."
        ctaLabel="Commander sur WhatsApp"
        ctaHref={WA_CUPCAKES}
        badges={["Boîte de 6 · CHF 24", "Boîte de 12 minis · CHF 28", "Thème au choix"]}
        image="/images/cupcakes/cupcake-02.webp"
        imageAlt="Boîte de cupcakes personnalisés sur le thème Stitch réalisée par Maman Gâteau à Pully"
        imageW={1600}
        imageH={1195}
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Deux formats"
            title="Simple comme"
            script="une boîte à ouvrir"
          />
          <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
            {[
              ["Boîte de 6 cupcakes", "CHF 24", "le format goûter — généreux, décorés un à un"],
              ["Boîte de 12 mini-cupcakes", "CHF 28", "le format bouchée — idéal sweet table et apéros"],
            ].map(([label, prix, note]) => (
              <div key={label} data-reveal className="rounded-3xl border border-gold/30 bg-vanilla px-8 py-9 text-center">
                <p className="font-display text-xl text-chocolate">{label}</p>
                <p className="font-display mt-3 text-4xl text-chocolate">{prix}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-grey-studio">{note}</p>
              </div>
            ))}
          </div>
          <p data-reveal className="mt-6 text-center text-sm text-grey-studio">
            Envie de les ajouter à un gâteau ? Ils s'ajoutent en un geste dans le configurateur, à l'étape des goûts.
          </p>
        </div>
      </section>

      <section className="bg-vanilla py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Dernières fournées"
            title="Décorés un à un,"
            script="jamais deux fois pareils"
          />
          <Gallery items={GALERIE} three={false} />
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Questions fréquentes" title="En deux mots" script="avant de croquer" />
          <Faq items={FAQ} />
        </div>
      </section>

      <CtaBand
        script="Une boîte pour votre fête ?"
        text="Dites-moi le thème, la date et le format — je vous réponds dans la journée. Et pour les accompagner d'un gâteau, le configurateur fait tout en une seule demande."
        ctaLabel="Commander mes cupcakes"
        ctaHref={WA_CUPCAKES}
        note="Réponse rapide par WhatsApp — ou composez gâteau + cupcakes dans le configurateur."
      />

      <CrossLinks
        links={[
          { href: "/gateau-anniversaire-lausanne", label: "Gâteau d'anniversaire", desc: "Enfants et adultes : le gâteau qui leur ressemble.", img: "/images/anniversaire/anniv-02.webp" },
          { href: "/gateau-mariage-lausanne", label: "Gâteau de mariage", desc: "Wedding cakes élégants, dégustation et installation offerte.", img: "/images/mariage/mariage-01.webp" },
        ]}
      />
    </PageShell>
  );
}
