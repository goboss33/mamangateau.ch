import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { JsonLd } from "@/components/pages/blocks";
import {
  journalEntry, journalList, CATEGORY_LABEL, CATEGORY_PILLAR, JOURNAL_SEGMENT,
} from "@/lib/journal";
import { SITE } from "@/lib/data";

export const revalidate = 3600; // + rafraîchi immédiatement par le webhook Carnet

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = await journalEntry(slug);
  if (!e) return { title: "Page introuvable | Maman Gâteau", robots: { index: false } };
  const title = e.metaTitle || `${e.title} | Maman Gâteau`;
  const description = e.metaDescription || e.title;
  return {
    title,
    description,
    keywords: e.keywords,
    alternates: { canonical: `/${JOURNAL_SEGMENT}/${e.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/${JOURNAL_SEGMENT}/${e.slug}`,
      ...(e.cover ? { images: [{ url: e.cover.src, alt: e.cover.alt }] } : {}),
    },
  };
}

/* ------------------------------------------------ markdown minimal (server) */
function bold(s: string, key: string): React.ReactNode[] {
  return s.split(/\*\*(.+?)\*\*/g).map((p, i) =>
    i % 2 ? <strong key={`${key}b${i}`} className="font-semibold text-chocolate">{p}</strong> : p
  );
}
function inline(s: string, key: string | number = 0): React.ReactNode[] {
  // ==mot== → surligneur rose ; puis **gras**
  const out: React.ReactNode[] = [];
  s.split(/==(.+?)==/g).forEach((p, i) => {
    if (i % 2) out.push(<span key={`${key}h${i}`} className="mg-hl">{bold(p, `${key}-${i}`)}</span>);
    else out.push(...bold(p, `${key}-${i}`));
  });
  return out;
}
function Story({ md, bodyImages = [] }: { md: string; bodyImages?: { src: string; alt: string; width: number; height: number }[] }) {
  return (
    <div className="mg-story space-y-5 leading-relaxed text-cocoa">
      {md.split(/\n{2,}/).map((b, i) => {
        const t = b.trim();
        if (!t) return null;
        const ph = t.match(/^\[\[photo:(\d+)(?:\|(left|right))?\]\]$/);
        if (ph) {
          const img = bodyImages[Number(ph[1]) - 1];
          if (!img) return null; // marqueur orphelin (photo retirée) : ignoré
          const pos = ph[2];
          const portrait = img.height > img.width;
          if (pos) {
            // flottante : le texte habille (desktop) — pleine largeur sur mobile
            return (
              <Image
                key={i}
                src={img.src} alt={img.alt}
                width={img.width} height={img.height}
                sizes="(max-width: 768px) 100vw, 280px"
                className={`!my-4 h-auto w-full rounded-3xl ${pos === "left" ? "mg-float-left" : "mg-float-right"}`}
              />
            );
          }
          return (
            <Image
              key={i}
              src={img.src} alt={img.alt}
              width={img.width} height={img.height}
              sizes="(max-width: 768px) 100vw, 672px"
              className={portrait ? "!my-8 mx-auto h-auto max-h-[520px] w-auto rounded-3xl" : "!my-8 h-auto w-full rounded-3xl"}
            />
          );
        }
        if (t.startsWith("> ")) {
          const inner = t.split(/\n/).map((l) => l.replace(/^>\s?/, "")).join(" ").trim();
          return <div key={i} className="mg-note !my-7 clear-both">{inline(inner, i)}</div>;
        }
        if (t.startsWith("## ")) return <h2 key={i} className="font-display pt-3 text-2xl text-chocolate md:text-3xl">{inline(t.slice(3), i)}</h2>;
        if (t.startsWith("### ")) return <h3 key={i} className="font-display pt-2 text-xl text-chocolate">{inline(t.slice(4), i)}</h3>;
        if (/^[-*] /m.test(t))
          return (
            <ul key={i}>
              {t.split(/\n/).filter((l) => /^[-*] /.test(l.trim())).map((l, k) => <li key={k}>{inline(l.trim().slice(2), k)}</li>)}
            </ul>
          );
        return <p key={i}>{inline(t, i)}</p>;
      })}
      <div className="clear-both" />
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const e = await journalEntry(slug);
  if (!e) notFound();

  const others = (await journalList()).filter((o) => o.slug !== e.slug).slice(0, 3);
  const pillar = CATEGORY_PILLAR[e.category];
  const gallery = e.type === "CREATION" ? e.images : e.images.slice(0, 1);
  const hero = e.cover ?? gallery[0] ?? null;

  /* Récit illustré : les photos hors couverture, dans l'ordre — indices
     alignés sur les marqueurs [[photo:N]] générés par Carnet. */
  const bodyImages = e.images.filter((img) => img.src !== e.cover?.src);
  const hasMarkers = /\[\[photo:\d+\]\]/.test(e.story);
  const usedIdx = new Set([...e.story.matchAll(/\[\[photo:(\d+)\]\]/g)].map((m) => Number(m[1]) - 1));
  const leftover = hasMarkers ? bodyImages.filter((_, i) => !usedIdx.has(i)) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: e.title,
    description: e.metaDescription,
    datePublished: e.publishedAt ?? undefined,
    dateModified: e.updatedAt,
    inLanguage: "fr-CH",
    image: e.images.map((i) => i.src),
    author: { "@type": "Person", name: "Annie", url: SITE.domain },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.domain, logo: { "@type": "ImageObject", url: `${SITE.domain}/images/logo-carre.png` } },
    mainEntityOfPage: `${SITE.domain}/${JOURNAL_SEGMENT}/${e.slug}`,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.domain },
      { "@type": "ListItem", position: 2, name: "Le journal", item: `${SITE.domain}/${JOURNAL_SEGMENT}` },
      { "@type": "ListItem", position: 3, name: e.title, item: `${SITE.domain}/${JOURNAL_SEGMENT}/${e.slug}` },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={[jsonLd, breadcrumb]} />

      {/* ------------------------------------------------------------ hero */}
      <section className="bg-cream pb-12 pt-36 md:pb-16 md:pt-44">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p data-reveal className="eyebrow mb-4">
            <Link href={`/${JOURNAL_SEGMENT}`} className="hover:underline">Le journal</Link>
            {" · "}
            <Link href={`/${JOURNAL_SEGMENT}?cat=${e.category}`} className="hover:underline">{CATEGORY_LABEL[e.category]}</Link>
          </p>
          <h1 data-reveal className="section-title mx-auto">{e.title}</h1>
          {e.publishedAt && (
            <p data-reveal className="mt-4 text-[13px] uppercase tracking-widest text-cocoa/70">
              {new Date(e.publishedAt).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" })} · Atelier de Pully
            </p>
          )}
        </div>
      </section>

      {/* -------------------------------------------------- galerie / cover */}
      {hero && (
        <section className="bg-cream pb-6">
          <div className="mx-auto max-w-5xl px-6">
            {/* ratio natif : les photos smartphone (portrait) s'affichent entières,
                centrées sur le fond crème — jamais recadrées, jamais de barres */}
            <div data-reveal>
              <Image
                src={hero.src} alt={hero.alt}
                width={hero.width} height={hero.height}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="mx-auto h-auto max-h-[640px] w-auto rounded-3xl"
                priority
              />
            </div>
            {!hasMarkers && gallery.filter((g) => g.src !== hero.src).length > 0 && (
              <div className="mt-4 grid items-start gap-4 sm:grid-cols-2">
                {gallery.filter((g) => g.src !== hero.src).map((img, i) => (
                  <div key={i} data-reveal>
                    <Image
                      src={img.src} alt={img.alt}
                      width={img.width} height={img.height}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="h-auto w-full rounded-3xl"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ récit */}
      <section className="bg-cream py-12 md:py-16">
        <div data-reveal className="mx-auto max-w-2xl px-6 text-[17px]">
          <Story md={e.story} bodyImages={hasMarkers ? bodyImages : []} />
          {leftover.length > 0 && (
            <div className="mt-8 grid items-start gap-4 sm:grid-cols-2">
              {leftover.map((img, i) => (
                <Image key={i} src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 640px) 100vw, 336px" className="h-auto w-full rounded-3xl" />
              ))}
            </div>
          )}
          {pillar && (
            <p className="mt-8 rounded-2xl border border-chocolate/10 bg-vanilla px-6 py-4 text-[15px]">
              📌 <Link href={pillar.href} className="font-semibold text-chocolate underline">{pillar.label}</Link>
              {" — "}prix, saveurs, délais et toutes les réponses à vos questions.
            </p>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------------- CTA */}
      <section className="bg-vanilla py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p data-reveal className="eyebrow mb-4">À votre tour</p>
          <h2 data-reveal className="section-title">
            Envie du vôtre ?
            <span className="script-accent mt-2 block text-[clamp(2.4rem,6vw,4rem)]">composez-le en 2 minutes</span>
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-xl leading-relaxed text-cocoa">
            Thème, nombre de parts, saveurs : décrivez le gâteau de vos rêves et recevez
            votre devis personnalisé — gratuit et sans engagement.
          </p>
          <Link
            href="/#configurateur"
            data-reveal
            className="mt-8 inline-flex items-center justify-center rounded-full bg-chocolate px-10 py-4 text-[15px] font-semibold text-vanilla shadow-[0_18px_38px_-18px_rgba(74,44,32,0.55)] transition-transform duration-300 hover:scale-[1.04]"
          >
            Composer mon gâteau
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------- autres histoires */}
      {others.length > 0 && (
        <section className="bg-cream py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p data-reveal className="eyebrow mb-8 text-center">D'autres histoires de l'atelier</p>
            <div className="grid gap-6 sm:grid-cols-3">
              {others.map((o) => (
                <Link key={o.slug} href={`/${JOURNAL_SEGMENT}/${o.slug}`} data-reveal className="group overflow-hidden rounded-3xl border border-chocolate/10 bg-vanilla">
                  {o.cover && (
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image src={o.cover.src} alt={o.cover.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    </div>
                  )}
                  <div className="px-5 py-4">
                    <p className="eyebrow mb-1 !text-[10px]">{CATEGORY_LABEL[o.category]}</p>
                    <h3 className="font-display text-lg leading-snug text-chocolate">{o.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
