import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { SectionHead, Steps, Faq, JsonLd, breadcrumbJsonLd, type FaqItem } from "@/components/pages/blocks";
import PartnerForm from "@/components/pages/PartnerForm";

export const metadata: Metadata = {
  title: "Devenir partenaire — commerces & pros | Maman Gâteau",
  description:
    "Cafés, boulangeries, photographes, wedding planners : recommandez un cake designer de confiance à vos clients et touchez 10 % de commission sur chaque commande apportée. Flyers personnalisés à votre code. Lausanne & canton de Vaud.",
  alternates: { canonical: "/partenaires" },
  openGraph: {
    title: "Devenir partenaire | Maman Gâteau",
    description: "Vos clients méritent un beau gâteau — recommandez, touchez 10 % de commission. Partenariats pros, Lausanne & Vaud.",
    url: "/partenaires",
  },
};

const POUR_QUI = [
  { emoji: "☕", title: "Cafés & salons de thé", text: "Vos habitués fêtent des anniversaires toute l'année — offrez-leur une adresse de confiance." },
  { emoji: "🥖", title: "Boulangeries & épiceries", text: "On vous demande des gâteaux personnalisés que vous ne faites pas ? Recommandez, on s'occupe du reste." },
  { emoji: "📸", title: "Photographes", text: "Un beau gâteau, ce sont de belles photos. Vos shootings d'anniversaire et de mariage méritent la pièce maîtresse." },
  { emoji: "💍", title: "Wedding planners & salles", text: "Un wedding cake fiable, installé sur place le jour J — un souci de moins dans votre coordination." },
  { emoji: "🎈", title: "Événementiel & animation", text: "Anniversaires d'enfants, baby showers, fêtes d'entreprise : complétez votre offre sans effort." },
  { emoji: "✨", title: "Une autre idée ?", text: "Fleuristes, crèches, salles de sport… Si vos clients fêtent quelque chose, parlons-en." },
];

const FAQ: FaqItem[] = [
  {
    q: "Qu'est-ce que j'y gagne concrètement ?",
    a: "10 % du montant de chaque commande apportée, tout simplement. Pas de palier, pas de petites lignes : une cliente commande avec votre code, 10 % du gâteau vous reviennent — versés comme vous préférez, Twint ou virement.",
  },
  {
    q: "Comment mes recommandations sont-elles comptées ?",
    a: "Vous recevez des flyers élégants imprimés avec votre code partenaire et un QR code personnalisé. Quand une cliente commande avec votre code — via le configurateur du site ou en le mentionnant — la commande vous est attribuée automatiquement. Transparent et vérifiable.",
  },
  {
    q: "Est-ce que ça m'engage à quelque chose ?",
    a: "Non. Pas de contrat, pas d'exclusivité, pas de minimum. Vous posez les flyers, vous en parlez quand c'est pertinent — c'est tout. Si ça ne vous convient plus, on arrête, sans formalité.",
  },
  {
    q: "Qui est derrière Maman Gâteau ?",
    a: "Annie, cheffe formée en gastronomie et passée par une maison étoilée, installée à Pully. Gâteaux d'anniversaire, de mariage et d'événement sur mesure, pour Lausanne et tout le canton de Vaud — notés 5 étoiles par nos clientes sur Google.",
  },
];

export default function Page() {
  return (
    <PageShell>
      <JsonLd data={[breadcrumbJsonLd("Devenir partenaire", "/partenaires")]} />

      <section className="bg-cream pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p data-reveal className="eyebrow mb-4">Commerces, artisans & pros de l'événement</p>
          <h1 data-reveal className="section-title mx-auto max-w-3xl">
            Vos clients méritent un beau gâteau.
            <span className="script-accent mt-2 block text-[clamp(2.6rem,7vw,4.6rem)]">recommandez, on partage</span>
          </h1>
          <p data-reveal className="mx-auto mt-6 max-w-2xl leading-relaxed text-cocoa">
            Vos clients fêtent des anniversaires, se marient, célèbrent — et vous demandent
            parfois une bonne adresse. Devenez partenaire de Maman Gâteau : vous recommandez
            un cake designer de confiance, vos clients vous remercient, et vous touchez
            <strong className="font-semibold text-chocolate"> 10 % de commission</strong> sur
            chaque commande apportée. Simple, transparent, sans engagement.
          </p>
          <a
            data-reveal
            href="#candidature"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-chocolate px-10 py-4 text-[15px] font-semibold text-vanilla shadow-[0_18px_38px_-18px_rgba(74,44,32,0.55)] transition-transform duration-300 hover:scale-[1.04]"
          >
            Proposer un partenariat
          </a>
        </div>
      </section>

      <section className="bg-vanilla py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="En trois étapes"
            title="Comment ça marche"
            script="c'est tout simple"
            lead="Aucune logistique de votre côté : vous recommandez, je m'occupe de tout le reste — création, livraison, sourire compris."
          />
          <Steps
            items={[
              { title: "Vous postulez", text: "Deux minutes de formulaire, c'est tout. Annie valide votre candidature et vous recontacte sous 24 h — le plus souvent sur WhatsApp." },
              { title: "Vous recevez vos flyers", text: "Des flyers élégants à votre code partenaire, avec QR code personnalisé, prêts à poser sur votre comptoir ou à glisser dans vos commandes." },
              { title: "Vous touchez 10 %", text: "Chaque commande passée avec votre code vous est attribuée automatiquement — et 10 % de son montant vous reviennent, en toute transparence." },
            ]}
          />
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Pour qui ?"
            title="Vous touchez nos clientes"
            script="avant nous"
            lead="Cafés, artisans, prestataires de l'événement : si vos clients fêtent quelque chose, on a toutes les raisons de travailler ensemble."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POUR_QUI.map((p) => (
              <div key={p.title} data-reveal className="rounded-3xl border border-chocolate/10 bg-vanilla px-7 py-8">
                <span className="text-2xl" aria-hidden>{p.emoji}</span>
                <h3 className="font-display mt-3 text-xl text-chocolate">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-cocoa">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="candidature" className="bg-vanilla py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Candidature"
            title="Proposez votre partenariat"
            script="deux minutes suffisent"
            lead="Annie répond personnellement à chaque candidature — en général sous 24 h, le plus souvent sur WhatsApp."
          />
          <PartnerForm />
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Questions fréquentes" title="Tout ce qu'on nous demande" script="avant de dire oui" lead="" />
          <Faq items={FAQ} />
        </div>
      </section>
    </PageShell>
  );
}
