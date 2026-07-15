import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import {
  LandingHero,
  SectionHead,
  Gallery,
  Steps,
  Faq,
  CtaBand,
  CrossLinks,
  JsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type FaqItem,
  type GalleryItem,
} from "@/components/pages/blocks";

export const metadata: Metadata = {
  title: "Gâteau d'anniversaire sur mesure à Lausanne | Maman Gâteau",
  description:
    "Gâteaux d'anniversaire personnalisés pour enfants et adultes à Lausanne, Pully et sur la Riviera : licorne, princesse, dinosaure, élégance dorée… Dès CHF 100, devis gratuit sous 24 h.",
  alternates: { canonical: "/gateau-anniversaire-lausanne" },
  openGraph: {
    title: "Gâteau d'anniversaire sur mesure à Lausanne | Maman Gâteau",
    description:
      "Des gâteaux d'anniversaire aussi beaux que délicieux, créés à Pully pour Lausanne et la Riviera. Devis gratuit sous 24 h.",
    url: "/gateau-anniversaire-lausanne",
    images: [{ url: "/images/og-anniversaire.jpg", width: 1200, height: 630, alt: "Gâteau d'anniversaire sur mesure — Maman Gâteau, Lausanne" }],
  },
};

const ENFANTS: GalleryItem[] = [
  { src: "/images/anniversaire/anniv-06.webp", alt: "Gâteau d'anniversaire château de princesse rose et or, prénom Helena — Lausanne", w: 1066, h: 1600 },
  { src: "/images/anniversaire/anniv-02.webp", alt: "Gâteau d'anniversaire licorne pastel à corne dorée pour les 5 ans de Sophia", w: 864, h: 1184 },
  { src: "/images/anniversaire/anniv-10.webp", alt: "Gâteau d'anniversaire dinosaure T-rex avec coulures de chocolat pour un garçon de 9 ans", w: 896, h: 1200 },
  { src: "/images/anniversaire/anniv-01.webp", alt: "Gâteau d'anniversaire petite sirène bleu avec coquillages en sucre", w: 864, h: 1184 },
  { src: "/images/anniversaire/anniv-15.webp", alt: "Gâteau d'anniversaire Spiderman rouge pour un enfant de 4 ans", w: 896, h: 1195 },
  { src: "/images/anniversaire/anniv-07.webp", alt: "Gâteau d'anniversaire kawaii violet avec personnage pour les 11 ans de Tihana", w: 1195, h: 1600 },
  { src: "/images/anniversaire/anniv-12.webp", alt: "Gâteau jungle à deux étages avec animaux en sucre pour un premier anniversaire", w: 848, h: 1256 },
  { src: "/images/anniversaire/anniv-03.webp", alt: "Gâteau d'anniversaire queue de sirène turquoise et violet", w: 864, h: 1184 },
  { src: "/images/anniversaire/anniv-11.webp", alt: "Gâteau d'anniversaire bleu ciel avec chat et cheval pour les 10 ans d'Alicia", w: 896, h: 1195 },
  { src: "/images/anniversaire/anniv-16.webp", alt: "Gâteau bleu tendre à deux étages pour les 30 jours de bébé Léo", w: 896, h: 1195 },
  { src: "/images/anniversaire/anniv-09.webp", alt: "Gâteau à deux étages blanc et mauve avec roses pour les 12 ans de Tolya", w: 864, h: 1184 },
];

const ADULTES: GalleryItem[] = [
  { src: "/images/anniversaire/anniv-08.webp", alt: "Gâteau d'anniversaire adulte corail plissé avec fleurs et topper Happy Birthday", w: 896, h: 1200 },
  { src: "/images/anniversaire/anniv-13.webp", alt: "Gâteau d'anniversaire or et blanc pour un 40e anniversaire — Lausanne", w: 848, h: 1256 },
  { src: "/images/anniversaire/anniv-14.webp", alt: "Gâteau d'anniversaire drip noir et or sur le thème du whisky", w: 896, h: 1195 },
  { src: "/images/anniversaire/anniv-17.webp", alt: "Gâteau d'anniversaire glamour noir et rose pour un 18e anniversaire", w: 896, h: 1195 },
  { src: "/images/anniversaire/anniv-04.webp", alt: "Gâteau cœur vintage rose avec couronne dorée", w: 1195, h: 1600 },
  { src: "/images/anniversaire/anniv-05.webp", alt: "Gâteau cœur vintage à volants roses et nœud en ruban, prénom Albina", w: 1195, h: 1600 },
];

const FAQ: FaqItem[] = [
  {
    q: "Combien coûte un gâteau d'anniversaire sur mesure ?",
    a: "Le prix est unique et dégressif — plus le gâteau est grand, plus la part devient douce : dès CHF 100 pour 12 parts, CHF 145 pour 20 parts, CHF 210 pour 30 parts, soit CHF 7 à 8.50 la part, beau décor compris. Un gâteau à deux étages (possible dès 26 parts) ajoute CHF 25. Le configurateur vous affiche le prix en direct, et je le confirme avec le devis — gratuit et sans engagement.",
  },
  {
    q: "Combien de temps à l'avance faut-il commander ?",
    a: "Idéalement 2 à 3 semaines avant la fête : les week-ends se remplissent vite. Votre date approche ? Écrivez-moi quand même — quand mon planning le permet, je fais mon possible.",
  },
  {
    q: "Livrez-vous à Lausanne et dans la région ?",
    a: "Oui. La livraison est offerte jusqu'à 10 km de Pully (Lausanne, Lutry, Renens…), puis CHF 1 par kilomètre — le montant exact se calcule automatiquement dans le configurateur. Vous pouvez aussi retirer votre gâteau à l'atelier, à Pully.",
  },
  {
    q: "Proposez-vous des gâteaux sans lactose ? Et sans gluten ?",
    a: "Une version sans lactose est possible sur demande pour la plupart des créations — mentionnez-le simplement dans votre demande de devis. En revanche, je ne propose pas de version sans gluten.",
  },
  {
    q: "Comment se passent la commande et le paiement ?",
    a: "Après validation du devis, un acompte de 30 % confirme la commande ; le solde se règle à la livraison ou au retrait. Twint et espèces acceptés.",
  },
  {
    q: "Pouvez-vous reproduire un thème précis (licorne, dinosaure, super-héros…) ?",
    a: "Oui, c'est ma spécialité : envoyez-moi jusqu'à trois photos d'inspiration dans le configurateur et décrivez l'univers de votre enfant. J'adapte le décor, les couleurs et le petit prénom en sucre pour un gâteau unique.",
  },
  {
    q: "Combien de parts prévoir pour un anniversaire ?",
    a: "Comptez une part par invité — un peu plus si vos convives sont gourmands. Un gâteau à un étage couvre 12 à 30 parts ; au-delà de 26 parts, un deux-étages fait toujours son effet.",
  },
];

export default function Page() {
  return (
    <PageShell>
      <JsonLd data={[faqJsonLd(FAQ), breadcrumbJsonLd("Gâteau d'anniversaire à Lausanne", "/gateau-anniversaire-lausanne")]} />

      <LandingHero
        crumb="Gâteau d'anniversaire"
        title="Gâteau d'anniversaire sur mesure à Lausanne"
        script="celui qui leur ressemble"
        lead="Licorne, château de princesse, dinosaure ou élégance dorée : je crée le gâteau qui raconte la personne que vous fêtez — et qui régale tous les invités. Créations artisanales à Pully, pour Lausanne et toute la Riviera."
        ctaLabel="Composer mon gâteau"
        ctaHref="/#configurateur"
        badges={["Devis gratuit sous 24 h", "Livraison Lausanne & Riviera", "Prénom et âge inclus"]}
        image="/images/anniversaire/anniv-06.webp"
        imageAlt="Gâteau d'anniversaire château de princesse rose et or réalisé par Maman Gâteau à Pully"
        imageW={1066}
        imageH={1600}
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Pour les enfants"
            title="Des yeux qui s'illuminent"
            script="avant même la première bouchée"
            lead="Chaque gâteau d'enfant part de son univers : ses héros, ses couleurs, son prénom. Voici quelques fêtes auxquelles j'ai eu la joie de participer."
          />
          <Gallery items={ENFANTS} />
        </div>
      </section>

      <section className="bg-vanilla py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Pour les adultes"
            title="L'élégance se fête"
            script="à tout âge"
            lead="18, 30, 40 ans ou juste l'envie de marquer le coup : des créations plus couture, du cœur vintage au drip doré, toujours aussi bonnes que belles."
          />
          <Gallery items={ADULTES} />
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Le prix juste"
            title="Combien coûte"
            script="un gâteau sur mesure ?"
            lead="Prix unique et dégressif : plus le gâteau est grand, plus la part devient douce. Quelques repères — le configurateur affiche le prix en direct, et le devis reste gratuit."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["12–15 parts", "dès CHF 100", "goûter d'anniversaire"],
              ["20 parts", "CHF 145", "la fête de famille"],
              ["30 parts", "CHF 210", "la grande tablée"],
              ["2 étages · dès 26 parts", "+ CHF 25", "l'effet waouh"],
            ].map(([parts, prix, note]) => (
              <div key={parts} data-reveal className="rounded-3xl border border-chocolate/10 bg-vanilla px-6 py-7 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-studio">{parts}</p>
                <p className="font-display mt-2 text-2xl text-chocolate">{prix}</p>
                <p className="mt-1 text-[13px] text-grey-studio">{note}</p>
              </div>
            ))}
          </div>
          <p data-reveal className="mt-6 text-center text-sm text-grey-studio">
            Fourrages premium +CHF 8 à 10 · livraison offerte jusqu'à 10 km de Pully, puis CHF 1/km.
          </p>
        </div>
      </section>

      <section className="bg-vanilla py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Comment ça marche"
            title="Trois gestes,"
            script="et c'est en route"
          />
          <Steps
            items={[
              { title: "Composez en ligne", text: "Occasion, parts, goûts, style, photos d'inspiration : le configurateur construit votre gâteau sous vos yeux, avec une estimation en direct." },
              { title: "Je vous réponds sous 24 h", text: "Vous recevez un devis précis et personnel. On ajuste ensemble les détails — c'est gratuit et sans engagement." },
              { title: "Le jour J, tout est prêt", text: "Livraison soignée à domicile ou retrait à l'atelier de Pully. Il ne reste qu'à souffler les bougies." },
            ]}
          />
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Questions fréquentes" title="Tout ce qu'on me demande" script="avant de commander" />
          <Faq items={FAQ} />
        </div>
      </section>

      <CtaBand
        script="Et si on créait le sien ?"
        text="Racontez-moi la personne que vous fêtez : son univers, ses couleurs, ses envies. Le devis arrive dans votre boîte mail sous 24 h."
        ctaLabel="Composer mon gâteau d'anniversaire"
        ctaHref="/#configurateur"
        note="Gratuit et sans engagement — réponse personnelle d'Annie."
      />

      <CrossLinks
        links={[
          { href: "/gateau-mariage-lausanne", label: "Gâteau de mariage", desc: "Wedding cakes élégants, dégustation et installation offerte.", img: "/images/mariage/mariage-01.webp" },
          { href: "/cupcakes-lausanne", label: "Cupcakes personnalisés", desc: "Boîtes de 6 ou 12 minis, assorties à votre gâteau.", img: "/images/cupcakes/cupcake-02.webp" },
        ]}
      />
    </PageShell>
  );
}
