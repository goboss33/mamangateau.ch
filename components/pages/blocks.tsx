/* ---------------------------------------------------------------------------
   Blocs partagés des pages ciblées (anniversaire, mariage, cupcakes)
   Composants serveur : les animations viennent de [data-reveal] (Experience),
   la FAQ repose sur <details> natif — zéro JS embarqué.
--------------------------------------------------------------------------- */

import Image from "next/image";
import { googleRating } from "@/lib/google";
import { SITE } from "@/lib/data";

export type GalleryItem = { src: string; alt: string; w: number; h: number };
export type FaqItem = { q: string; a: string };

/* ------------------------------------------------------------- JSON-LD */

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.domain },
      { "@type": "ListItem", position: 2, name, item: `${SITE.domain}${path}` },
    ],
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- Hero */

export function LandingHero({
  crumb,
  title,
  script,
  lead,
  ctaLabel,
  ctaHref,
  badges,
  image,
  imageAlt,
  imageW,
  imageH,
}: {
  crumb: string;
  title: string;
  script: string;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
  badges: string[];
  image: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
}) {
  return (
    <header className="relative overflow-hidden bg-vanilla pb-16 pt-28 md:pb-24 md:pt-36">
      <div
        className="pointer-events-none absolute -right-40 top-16 h-[540px] w-[540px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(246,201,212,0.5) 0%, transparent 65%)" }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.9fr] lg:gap-16">
        <div>
          <nav data-reveal aria-label="Fil d'Ariane" className="eyebrow mb-5">
            <a href="/" className="transition-colors hover:text-chocolate">Accueil</a>
            <span aria-hidden> · </span>
            <span>{crumb}</span>
          </nav>
          <h1 data-reveal className="section-title">
            {title}
            <span className="script-accent block pt-2 text-[clamp(2.3rem,5.6vw,4rem)]">{script}</span>
          </h1>
          <p data-reveal className="mt-6 max-w-xl leading-relaxed text-cocoa">{lead}</p>
          <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
            <a href={ctaHref} className="btn-primary">{ctaLabel}</a>
            <a
              href="/#creations"
              className="inline-flex items-center gap-2 rounded-full border border-chocolate/20 px-6 py-3.5 font-semibold text-chocolate transition-all duration-300 hover:border-gold hover:text-cocoa"
            >
              Voir toutes les créations
            </a>
          </div>
          <ul data-reveal className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-grey-studio">
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal="scale" className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="gilded overflow-hidden rounded-[28px]">
            <Image
              src={image}
              alt={imageAlt}
              width={imageW}
              height={imageH}
              priority
              sizes="(max-width: 1024px) 92vw, 480px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------- Entête */

export function SectionHead({
  eyebrow,
  title,
  script,
  lead,
  light = false,
}: {
  eyebrow: string;
  title: string;
  script?: string;
  lead?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-12 max-w-2xl md:mb-16">
      <p data-reveal className="eyebrow mb-4">{eyebrow}</p>
      <h2 data-reveal className={`section-title ${light ? "!text-vanilla" : ""}`}>
        {title}
        {script && (
          <span className="script-accent block pt-2 text-[clamp(2.1rem,5vw,3.4rem)]">{script}</span>
        )}
      </h2>
      {lead && (
        <p data-reveal className={`mt-5 leading-relaxed ${light ? "text-vanilla/70" : "text-cocoa"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Galerie */

export function Gallery({ items, three = true }: { items: GalleryItem[]; three?: boolean }) {
  return (
    <div className={`columns-2 gap-4 md:gap-5 ${three ? "lg:columns-3" : ""} [&>figure]:break-inside-avoid`}>
      {items.map((it, i) => (
        <figure
          key={it.src}
          data-reveal
          className="group relative mb-4 overflow-hidden rounded-2xl bg-cream shadow-[0_18px_38px_-24px_rgba(74,44,32,0.35)] md:mb-5"
        >
          <Image
            src={it.src}
            alt={it.alt}
            width={it.w}
            height={it.h}
            loading={i < 3 ? "eager" : "lazy"}
            sizes="(max-width: 768px) 46vw, (max-width: 1024px) 44vw, 30vw"
            className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </figure>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- Étapes */

export function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
      {items.map((s, i) => (
        <li key={s.title} data-reveal className="relative rounded-3xl border border-chocolate/10 bg-vanilla px-7 py-8">
          <span className="font-display text-sm tracking-[0.2em] text-gold">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="font-display mt-3 text-xl text-chocolate">{s.title}</h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-cocoa">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ----------------------------------------------------------------- FAQ */

export async function Faq({ items }: { items: FaqItem[] }) {
  const google = await googleRating();
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f) => (
        <details
          key={f.q}
          data-reveal
          className="group rounded-2xl border border-chocolate/10 bg-vanilla px-6 py-1 open:border-gold/40 open:shadow-[0_16px_36px_-24px_rgba(74,44,32,0.4)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-chocolate [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold transition-transform duration-300 group-open:rotate-45"
              aria-hidden
            >
              +
            </span>
          </summary>
          <p className="pb-5 leading-relaxed text-cocoa">{f.a}</p>
        </details>
      ))}
      <p data-reveal className="pt-5 text-center text-sm text-grey-studio">
        <a
          href={google.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline decoration-gold/50 underline-offset-4 transition-colors hover:text-chocolate"
        >
          <span className="text-gold" aria-hidden>★</span>
          {google.rating} · {google.count} avis Google — voir la fiche
        </a>
      </p>
    </div>
  );
}

/* ----------------------------------------------------------- CTA final */

export function CtaBand({
  script,
  text,
  ctaLabel,
  ctaHref,
  note,
}: {
  script: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  note: string;
}) {
  return (
    <section className="relative overflow-hidden bg-chocolate py-20 md:py-28">
      <div className="gold-rule absolute inset-x-0 top-0" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p data-reveal className="font-script text-[clamp(2.6rem,7vw,4.4rem)] leading-[1.1] text-vanilla">
          {script}
        </p>
        <p data-reveal className="mx-auto mt-5 max-w-xl leading-relaxed text-vanilla/70">{text}</p>
        <div data-reveal className="mt-9">
          <a href={ctaHref} className="btn-primary !border !border-gold/40">{ctaLabel}</a>
        </div>
        <p data-reveal className="mt-5 text-xs text-vanilla/45">{note}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ liens croisés */

export function CrossLinks({
  links,
}: {
  links: { href: string; label: string; desc: string; img: string }[];
}) {
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p data-reveal className="eyebrow mb-8 text-center">À découvrir aussi</p>
        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-reveal
              className="group flex items-center gap-5 rounded-3xl border border-chocolate/10 bg-vanilla p-4 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_18px_40px_-24px_rgba(74,44,32,0.45)]"
            >
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                <Image src={l.img} alt="" fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span>
                <span className="font-display block text-lg text-chocolate">{l.label}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-grey-studio">{l.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
