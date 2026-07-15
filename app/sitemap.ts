import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.domain, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.domain}/gateau-anniversaire-lausanne`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.domain}/gateau-mariage-lausanne`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.domain}/cupcakes-lausanne`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.domain}/partenaires`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
