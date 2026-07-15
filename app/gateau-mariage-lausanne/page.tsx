import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import {
  LandingHero,
  SectionHead,
  Steps,
  Faq,
  CtaBand,
  CrossLinks,
  JsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type FaqItem,
} from "@/components/pages/blocks";

export const metadata: Metadata = {
  title: "Gâteau de mariage sur mesure — Lausanne & Vaud | Maman Gâteau",
  description:
    "Wedding cake élégant et délicieux pour votre mariage à Lausanne et dans tout le canton de Vaud. Dégustation, création sur mesure, installation offerte sur votre lieu de réception. Devis gratuit.",
  alternates: { canonical: "/gateau-mariage-lausanne" },
  openGraph: {
    title: "Gâteau de mariage sur mesure — Lausanne & Vaud | Maman Gâteau",
    description:
      "Un wedding cake à la hauteur du plus beau jour : dégustation, design sur mesure et installation offerte, partout dans le canton de Vaud.",
    url: "/gateau-mariage-lausanne",
    images: [{ url: "/images/og-mariage.jpg", width: 1200, height: 630, alt: "Gâteau de mariage — Maman Gâteau, Lausanne & Vaud" }],
  },
};

/* Styles proposés — visuels d'inspiration en attendant les premières
   réalisations photographiées (voir décision : direction artistique). */
const STYLES_MARIAGE = [
  { src: "/images/mariage/mariage-01.webp", w: 893, h: 1600, title: "Esprit classique perlé", desc: "Deux étages immaculés, perles de sucre et roses fraîches — l'intemporel." },
  { src: "/images/mariage/mariage-03.webp", w: 1600, h: 893, title: "Esprit botanique", desc: "Crème délicate, eucalyptus et fleurs de saison, posé sur son présentoir doré." },
  { src: "/images/mariage/mariage-04.webp", w: 893, h: 1600, title: "Esprit drapé fleuri", desc: "Volutes de crème comme un voile, cascade de roses poudrées." },
  { src: "/images/mariage/mariage-02.webp", w: 893, h: 1600, title: "Esprit vintage doré", desc: "Volants à l'ancienne, lettrage or « Just Married », charme rétro." },
];

const FAQ: FaqItem[] = [
  {
    q: "Combien coûte un gâteau de mariage ?",
    a: "Comptez CHF 8.50 à 10 la part sur les formats courants, décor et finitions compris : CHF 295 pour 30 parts, CHF 455 pour un deux-étages de 50 parts, CHF 515 pour 60 parts — au-delà, devis personnalisé. L'installation sur votre lieu de réception est offerte. Le devis précis est gratuit et sans engagement.",
  },
  {
    q: "Peut-on goûter avant de commander ?",
    a: "Bien sûr — c'est même recommandé ! Dès l'acompte versé, une dégustation vous est offerte pour choisir vos parfums en toute sérénité. Vous préférez goûter avant de vous engager ? Optez pour la box dégustation à CHF 40 : quatre associations biscuit-fourrage à savourer à deux, et son montant est intégralement déduit de votre commande.",
  },
  {
    q: "Réalisez-vous d'autres styles que ceux présentés sur cette page ?",
    a: "Bien sûr — ces univers ne sont que des inspirations pour vous aider à rêver. Chaque wedding cake est une création sur mesure : partez de vos couleurs, de votre décoration, d'un tableau Pinterest ou d'une idée un peu folle, et je dessine un gâteau unique, créé pour votre mariage et pour lui seul.",
  },
  {
    q: "Combien de temps à l'avance réserver ?",
    a: "Idéalement 2 à 3 mois avant le mariage — cela laisse le temps de la dégustation et de la création du design. Pour la haute saison (mai à septembre), réservez votre date dès que possible. Mariage plus proche ? Écrivez-moi, on regarde ensemble.",
  },
  {
    q: "Livrez-vous sur le lieu de réception ?",
    a: "Oui, dans tout le canton de Vaud : Lavaux, La Côte, la Riviera, les domaines et châteaux de la région… La livraison est offerte jusqu'à 10 km de Pully, puis CHF 1 par kilomètre. Et le jour J, j'installe moi-même le gâteau sur place — c'est offert, et c'est plus prudent.",
  },
  {
    q: "Combien de parts prévoir pour un mariage ?",
    a: "Si le gâteau est le dessert principal, comptez une part par invité. S'il accompagne un buffet de desserts ou une sweet table, deux tiers des invités suffisent. Je vous conseille précisément selon votre déroulé de soirée.",
  },
  {
    q: "Comment se passe la réservation ?",
    a: "Un acompte de 30 % bloque votre date et lance la création (il inclut la dégustation offerte) ; le solde se règle à la livraison. Twint et espèces acceptés.",
  },
  {
    q: "Une version sans lactose est-elle possible ?",
    a: "Oui, sur demande, pour la plupart des créations. Parlez-m'en dès la demande de devis afin que la dégustation en tienne compte.",
  },
];

export default function Page() {
  return (
    <PageShell>
      <JsonLd data={[faqJsonLd(FAQ), breadcrumbJsonLd("Gâteau de mariage — Lausanne & Vaud", "/gateau-mariage-lausanne")]} />

      <LandingHero
        crumb="Gâteau de mariage"
        title="Un gâteau de mariage à la hauteur"
        script="du plus beau des oui"
        lead="Le wedding cake est la pièce que tous vos invités photographient — et celle qu'ils goûtent. Formée en gastronomie et passée par une maison étoilée, je crée le vôtre sur mesure et je l'installe moi-même sur votre lieu de réception, partout dans le canton de Vaud."
        ctaLabel="Composer notre gâteau"
        ctaHref="/?occasion=mariage#configurateur"
        badges={["Dégustation offerte avec l'acompte", "Installation offerte le jour J", "Tout le canton de Vaud"]}
        image="/images/mariage/mariage-01.webp"
        imageAlt="Wedding cake à deux étages blanc, perles de sucre et roses fraîches — création sur mesure Lausanne"
        imageW={893}
        imageH={1600}
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Quelques inspirations"
            title="Votre wedding cake sera unique"
            script="comme votre histoire"
            lead="Ces quatre ambiances donnent le ton — mais ce ne sont que des points de départ. Comme pour toutes mes créations, votre gâteau est dessiné sur mesure : vos couleurs, vos fleurs, votre décoration, votre thème."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {STYLES_MARIAGE.map((s) => (
              <figure key={s.src} data-reveal className="group overflow-hidden rounded-3xl bg-vanilla shadow-[0_18px_38px_-24px_rgba(74,44,32,0.35)]">
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={s.src}
                    alt={`Inspiration gâteau de mariage : ${s.title.toLowerCase()} — ${s.desc}`}
                    fill
                    sizes="(max-width: 640px) 92vw, 46vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <figcaption className="px-7 py-6">
                  <p className="font-display text-xl text-chocolate">{s.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-cocoa">{s.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div
            data-reveal
            className="mt-6 rounded-3xl border border-dashed border-gold/50 bg-vanilla/70 px-8 py-8 text-center md:px-12"
          >
            <p className="script-accent text-2xl md:text-3xl">vous imaginez tout autre chose ?</p>
            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-cocoa">
              Tant mieux — c'est exactement mon métier. Bohème, minimaliste, coloré, clin
              d'œil à votre rencontre… Envoyez-moi vos inspirations (Pinterest, Instagram,
              une photo de votre décoration) et je dessine un gâteau qui n'existera
              qu'une seule fois : le vôtre.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-vanilla py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="La dégustation"
            title="On choisit les parfums"
            script="les yeux fermés"
            lead="Un mariage ne se commande pas sur catalogue. Deux façons de goûter avant le grand jour :"
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div data-reveal className="rounded-3xl border border-gold/30 bg-cream/60 px-8 py-9">
              <p className="eyebrow mb-3">Vous êtes décidés</p>
              <p className="font-display text-2xl text-chocolate">Dégustation offerte</p>
              <p className="mt-3 leading-relaxed text-cocoa">
                Dès l'acompte de 30 % versé, je vous prépare une dégustation offerte pour
                composer vos étages : biscuits, fourrages, accords de saison.
              </p>
            </div>
            <div data-reveal className="rounded-3xl border border-chocolate/10 bg-cream/60 px-8 py-9">
              <p className="eyebrow mb-3">Vous préférez goûter d'abord</p>
              <p className="font-display text-2xl text-chocolate">Box dégustation · CHF 40</p>
              <p className="mt-3 leading-relaxed text-cocoa">
                Quatre associations biscuit-fourrage à savourer à deux, sans engagement —
                et si le cœur vous dit oui, les CHF 40 sont déduits de votre commande.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Le prix juste"
            title="Combien coûte"
            script="votre gâteau de mariage ?"
            lead="Chaque mariage est unique — voici quelques repères pour vous situer, décor et installation compris. Votre projet reçoit ensuite son devis précis : gratuit et sans engagement."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["30 parts", "CHF 295", "l'intime"],
              ["50 parts · 2 étages", "CHF 455", "le classique"],
              ["60 parts · 2 étages", "CHF 515", "la grande fête"],
            ].map(([parts, prix, note]) => (
              <div key={parts} data-reveal className="rounded-3xl border border-chocolate/10 bg-vanilla px-6 py-7 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-grey-studio">{parts}</p>
                <p className="font-display mt-2 text-2xl text-chocolate">{prix}</p>
                <p className="mt-1 text-[13px] text-grey-studio">{note}</p>
              </div>
            ))}
          </div>
          <p data-reveal className="mt-6 text-center text-sm text-grey-studio">
            Installation sur votre lieu de réception offerte · livraison offerte jusqu'à 10 km de Pully, puis CHF 1/km. Plus de 60 parts ? Devis personnalisé.
          </p>
          <div data-reveal className="mt-8 text-center">
            <a href="/?occasion=mariage#configurateur" className="btn-primary">Composer notre gâteau</a>
          </div>
        </div>
      </section>

      <section className="bg-vanilla py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Comment ça marche" title="Du premier message" script="à la première part" />
          <Steps
            items={[
              { title: "Racontez-nous", text: "Date, lieu, nombre d'invités, ambiance : composez votre projet en ligne, j'y réponds personnellement sous 24 h." },
              { title: "On goûte, on dessine", text: "Dégustation pour choisir les parfums, croquis du design assorti à votre décoration — on affine ensemble jusqu'au oui." },
              { title: "Le jour J, je m'occupe de tout", text: "Livraison et installation offertes sur votre lieu de réception, dans tout le canton de Vaud. Vous n'avez plus qu'à couper la première part." },
            ]}
          />
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Questions fréquentes" title="Tout ce que les mariés" script="me demandent" />
          <Faq items={FAQ} />
        </div>
      </section>

      <CtaBand
        script="Parlez-moi de votre mariage."
        text="La date, le lieu, le nombre d'invités, vos envies — composez votre projet en quelques gestes et recevez votre devis sous 24 h."
        ctaLabel="Composer notre wedding cake"
        ctaHref="/?occasion=mariage#configurateur"
        note="Gratuit et sans engagement — votre date est réservée dès l'acompte."
      />

      <CrossLinks
        links={[
          { href: "/gateau-anniversaire-lausanne", label: "Gâteau d'anniversaire", desc: "Enfants et adultes : le gâteau qui leur ressemble.", img: "/images/anniversaire/anniv-06.webp" },
          { href: "/cupcakes-lausanne", label: "Cupcakes personnalisés", desc: "En sweet table ou cadeau d'invités, assortis au gâteau.", img: "/images/cupcakes/cupcake-02.webp" },
        ]}
      />
    </PageShell>
  );
}
