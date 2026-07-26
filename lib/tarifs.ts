/* ---------------------------------------------------------------------------
   Tarifs — lus depuis Carnet (source de vérité), avec repli sur les valeurs
   locales de lib/data.ts.

   Une hausse de prix se saisit dans Carnet → Réglages → Tarifs et se répercute
   ici sans redéploiement. Si Carnet est indisponible, injoignable ou renvoie
   n'importe quoi, on sert les valeurs locales : la boutique ne tombe JAMAIS
   à cause du back-office.
--------------------------------------------------------------------------- */
import { PRICE_BANDS, MIN_PART_PRICE, TIER2, DELIVERY, FOURRAGES, EXTRAS, type Fourrage, type Extra } from "@/lib/data";

export type Tarifs = {
  bandsDefault: { max: number; price: number }[];
  bandsMariage: { max: number; price: number }[];
  minPartPrice: number;
  tier2Surcharge: number;
  fourrages: Fourrage[];
  extras: Extra[];
  kmFree: number;
  kmRate: number;
  origin: string;
  /* Avis Google saisis dans Carnet (voir lib/google.ts pour le pourquoi). */
  google: { rating: number; count: number; url: string };
};

/** Valeurs locales : ce que le site a toujours utilisé (et le filet de sécurité). */
export const DEFAULT_TARIFS: Tarifs = {
  bandsDefault: [...PRICE_BANDS.default],
  bandsMariage: [...PRICE_BANDS.mariage],
  minPartPrice: MIN_PART_PRICE,
  tier2Surcharge: TIER2.surcharge,
  fourrages: [...FOURRAGES],
  extras: [...EXTRAS],
  kmFree: DELIVERY.freeKm,
  kmRate: DELIVERY.chfPerKm,
  origin: DELIVERY.origin,
  google: { rating: 5, count: 0, url: "" },
};

const isBands = (v: unknown): v is { max: number; price: number }[] =>
  Array.isArray(v) && v.length > 0 && v.every((b) => b && typeof b.max === "number" && typeof b.price === "number");

/** Récupère les tarifs de Carnet (cache 5 min). Toujours un objet complet. */
export async function getTarifs(): Promise<Tarifs> {
  const base = (process.env.CARNET_URL ?? "").replace(/\/$/, "");
  if (!base) return DEFAULT_TARIFS;
  try {
    const res = await fetch(`${base}/api/tarifs`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`tarifs ${res.status}`);
    const data = await res.json();
    const p = data?.pricing;
    if (!p) throw new Error("payload vide");

    // Fusion champ par champ : une valeur douteuse retombe sur le défaut local.
    const num = (v: unknown, d: number) => (typeof v === "number" && isFinite(v) && v >= 0 ? v : d);
    return {
      bandsDefault: isBands(p.bandsDefault) ? p.bandsDefault : DEFAULT_TARIFS.bandsDefault,
      bandsMariage: isBands(p.bandsMariage) ? p.bandsMariage : DEFAULT_TARIFS.bandsMariage,
      minPartPrice: num(p.minPartPrice, DEFAULT_TARIFS.minPartPrice),
      tier2Surcharge: num(p.tier2Surcharge, DEFAULT_TARIFS.tier2Surcharge),
      fourrages: Array.isArray(p.fourrages) && p.fourrages.length
        ? p.fourrages
            .filter((f: Fourrage) => f && typeof f.id === "string" && typeof f.label === "string")
            .map((f: Fourrage) => ({ id: f.id, label: f.label, sup: num(f.sup, 0) }))
        : DEFAULT_TARIFS.fourrages,
      // Les extras gardent leurs libellés et descriptions locaux (textes du site),
      // seuls les PRIX viennent de Carnet.
      extras: DEFAULT_TARIFS.extras.map((x) =>
        x.id === "cupcakes-6" ? { ...x, price: num(p.cupcakePrice, x.price) }
        : x.id === "mini-cupcakes-12" ? { ...x, price: num(p.miniCupcakePrice, x.price) }
        : x
      ),
      kmFree: num(p.kmFree, DEFAULT_TARIFS.kmFree),
      kmRate: num(p.kmRate, DEFAULT_TARIFS.kmRate),
      origin: typeof p.origin === "string" && p.origin.trim() ? p.origin : DEFAULT_TARIFS.origin,
      google: {
        rating: num(data?.google?.rating, DEFAULT_TARIFS.google.rating),
        count: Math.round(num(data?.google?.count, DEFAULT_TARIFS.google.count)),
        url: typeof data?.google?.url === "string" ? data.google.url : DEFAULT_TARIFS.google.url,
      },
    };
  } catch (e) {
    console.warn("tarifs Carnet indisponibles, valeurs locales utilisées:", e instanceof Error ? e.message : e);
    return DEFAULT_TARIFS;
  }
}

/* ------------------------------------------------------------- calculs
   Mêmes formules que Carnet (lib/pricing.ts) : un seul comportement des deux
   côtés, seules les VALEURS transitent par l'API. */

export function cakeBaseT(t: Tarifs, parts: number, tiers: 1 | 2, occasion?: string | null): number {
  const bands = occasion === "mariage" ? t.bandsMariage : t.bandsDefault;
  const band = bands.find((b) => parts <= b.max) ?? bands[bands.length - 1];
  const floor = Math.ceil((parts * t.minPartPrice) / 5) * 5;
  return Math.max(band?.price ?? 0, floor) + (tiers === 2 ? t.tier2Surcharge : 0);
}

export function estimateTotalT(
  t: Tarifs,
  opts: { parts: number; tiers: 1 | 2; fourrages: string[]; deliveryFee: number | null; occasion?: string | null; extras?: Record<string, number> }
): { price: number; sup: number; extrasTotal: number } {
  const base = cakeBaseT(t, opts.parts, opts.tiers, opts.occasion);
  const sup = opts.fourrages.reduce((acc, id) => acc + (t.fourrages.find((f) => f.id === id)?.sup ?? 0), 0);
  const extrasTotal = Object.entries(opts.extras ?? {}).reduce(
    (acc, [id, qty]) => acc + (t.extras.find((e) => e.id === id)?.price ?? 0) * qty,
    0
  );
  return { price: base + sup + extrasTotal + (opts.deliveryFee ?? 0), sup, extrasTotal };
}
