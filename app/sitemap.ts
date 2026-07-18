import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";
import { journalList, JOURNAL_SEGMENT } from "@/lib/journal";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const journal = await journalList();
  return [
    { url: SITE.domain, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.domain}/gateau-anniversaire-lausanne`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.domain}/gateau-mariage-lausanne`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.domain}/cupcakes-lausanne`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.domain}/partenaires`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...(journal.length
      ? [{ url: `${SITE.domain}/${JOURNAL_SEGMENT}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 }]
      : []),
    ...journal.map((e) => ({
      url: `${SITE.domain}/${JOURNAL_SEGMENT}/${e.slug}`,
      lastModified: e.publishedAt ? new Date(e.publishedAt) : now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
