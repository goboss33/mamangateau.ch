/* ---------------------------------------------------------------------------
   Journal — lecture des pages publiées depuis l'API Carnet (ISR).
   Le site reste sans base de données : Carnet est la source, on ne fait
   que lire (entrées publiées uniquement) et mettre en cache.
   ⚠ Marque blanche : si tu renommes le dossier app/creations, change
   JOURNAL_SEGMENT ici (les deux doivent correspondre).
--------------------------------------------------------------------------- */

export const JOURNAL_SEGMENT = "creations";

export type JournalCategory = "ANNIVERSAIRE" | "MARIAGE" | "CUPCAKES" | "CONSEILS" | "ATELIER";

export const CATEGORY_LABEL: Record<JournalCategory, string> = {
  ANNIVERSAIRE: "Anniversaire",
  MARIAGE: "Mariage",
  CUPCAKES: "Cupcakes",
  CONSEILS: "Conseils",
  ATELIER: "Atelier",
};

/** Page pilier vers laquelle chaque catégorie renvoie (maillage interne). */
export const CATEGORY_PILLAR: Partial<Record<JournalCategory, { href: string; label: string }>> = {
  ANNIVERSAIRE: { href: "/gateau-anniversaire-lausanne", label: "Tout savoir sur nos gâteaux d'anniversaire" },
  MARIAGE: { href: "/gateau-mariage-lausanne", label: "Tout savoir sur nos wedding cakes" },
  CUPCAKES: { href: "/cupcakes-lausanne", label: "Découvrir nos cupcakes" },
};

export type JournalImage = { src: string; alt: string; width: number; height: number };

export type JournalListItem = {
  slug: string;
  type: "CREATION" | "ARTICLE";
  format: "ARTICLE" | "VIDEO" | "DIAPORAMA";
  category: JournalCategory;
  title: string;
  metaDescription: string;
  publishedAt: string | null;
  cover: JournalImage | null;
};

export type JournalDetail = JournalListItem & {
  youtubeUrl: string;
  video: { src: string; width: number | null; height: number | null; durationSec: number | null } | null;
  metaTitle: string;
  keywords: string[];
  story: string;
  updatedAt: string;
  images: JournalImage[];
};

/** Origine de Carnet, dérivée du hook déjà configuré (…/api/hooks/devis). */
function carnetBase(): string | null {
  const hook = process.env.CARNET_HOOK_URL;
  if (!hook) return null;
  try { return new URL(hook).origin; } catch { return null; }
}

const REVALIDATE = 3600; // filet — le webhook de Carnet rafraîchit immédiatement

type RawImage = { path: string; thumbPath?: string; alt: string; width: number | null; height: number | null } | null;

function toImg(raw: RawImage, thumb = false): JournalImage | null {
  if (!raw) return null;
  const p = thumb && raw.thumbPath ? raw.thumbPath : raw.path;
  return {
    // proxy local : le navigateur reste sur le domaine du site (cache CF)
    src: p.replace("/api/public/journal-media/", "/api/journal-media/"),
    alt: raw.alt ?? "",
    width: raw.width ?? 1080,
    height: raw.height ?? 1350,
  };
}

export async function journalList(category?: JournalCategory): Promise<JournalListItem[]> {
  const base = carnetBase();
  if (!base) return [];
  try {
    const res = await fetch(`${base}/api/public/journal?limit=100`, {
      next: { revalidate: REVALIDATE, tags: ["journal"] },
    });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return [];
    const j = await res.json();
    const items: JournalListItem[] = (j.entries ?? []).map((e: Record<string, unknown>) => ({
      slug: String(e.slug),
      type: e.type === "ARTICLE" ? "ARTICLE" : "CREATION",
      format: e.format === "VIDEO" ? "VIDEO" : e.format === "DIAPORAMA" ? "DIAPORAMA" : "ARTICLE",
      category: String(e.category) as JournalCategory,
      title: String(e.title ?? ""),
      metaDescription: String(e.metaDescription ?? ""),
      publishedAt: (e.publishedAt as string) ?? null,
      cover: toImg(e.cover as RawImage),
    }));
    return category ? items.filter((i) => i.category === category) : items;
  } catch (e) {
    console.error("journal list:", e);
    return [];
  }
}

export async function journalEntry(slug: string): Promise<JournalDetail | null> {
  const base = carnetBase();
  if (!base || !/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const res = await fetch(`${base}/api/public/journal/${slug}`, {
      next: { revalidate: REVALIDATE, tags: ["journal", `journal-${slug}`] },
    });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return null;
    const e = await res.json();
    const rawVideo = e.video as { path?: string; width?: number | null; height?: number | null; durationSec?: number | null } | null;
    return {
      slug: String(e.slug),
      type: e.type === "ARTICLE" ? "ARTICLE" : "CREATION",
      format: e.format === "VIDEO" ? "VIDEO" : e.format === "DIAPORAMA" ? "DIAPORAMA" : "ARTICLE",
      youtubeUrl: String(e.youtubeUrl ?? ""),
      video: rawVideo?.path
        ? { src: rawVideo.path.replace("/api/public/journal-media/", "/api/journal-media/"), width: rawVideo.width ?? null, height: rawVideo.height ?? null, durationSec: rawVideo.durationSec ?? null }
        : null,
      category: String(e.category) as JournalCategory,
      title: String(e.title ?? ""),
      metaTitle: String(e.metaTitle ?? ""),
      metaDescription: String(e.metaDescription ?? ""),
      keywords: Array.isArray(e.keywords) ? e.keywords.map(String) : [],
      story: String(e.story ?? ""),
      publishedAt: e.publishedAt ?? null,
      updatedAt: e.updatedAt ?? new Date().toISOString(),
      cover: e.cover ? toImg(e.cover as RawImage) : null,
      images: (Array.isArray(e.images) ? e.images : []).map((i: RawImage) => toImg(i)).filter(Boolean) as JournalImage[],
    };
  } catch (e) {
    console.error("journal entry:", e);
    return null;
  }
}
