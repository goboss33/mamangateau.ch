/* ---------------------------------------------------------------------------
   Note Google en direct (Places API New) — même clé serveur que le
   configurateur (GOOGLE_MAPS_SERVER_KEY). Le place_id est résolu tout seul
   par Text Search au premier rendu (mémorisé pour la vie du conteneur) ;
   GOOGLE_PLACE_ID en variable d'env permet de le forcer si besoin.
   Cache 24 h, fallback statique : rien ne casse sans clé.
--------------------------------------------------------------------------- */

import { unstable_cache } from "next/cache";

export type GoogleRating = { rating: string; count: number; url: string };

const FALLBACK: GoogleRating = {
  rating: "5,0",
  count: 5,
  url: "https://www.google.com/maps/search/?api=1&query=Maman+G%C3%A2teau+Pully",
};

/* Résolution du place_id par Text Search (POST — jamais caché par le data
   cache fetch) : isolée dans unstable_cache pour ne PAS rendre la page
   dynamique à la régénération ISR (sinon : « static to dynamic at
   runtime » → 500 de la home à chaque revalidation du Journal). */
const resolvePlaceIdCached = unstable_cache(
  async (key: string): Promise<string | null> => {
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "places.id,places.displayName",
        },
        body: JSON.stringify({ textQuery: "Maman Gâteau Pully Suisse", languageCode: "fr" }),
      });
      if (!res.ok) {
        console.error("places searchText", res.status, await res.text().catch(() => ""));
        return null;
      }
      const j = (await res.json()) as { places?: { id: string; displayName?: { text?: string } }[] };
      const hit =
        j.places?.find((p) => (p.displayName?.text ?? "").toLowerCase().includes("maman gâteau")) ?? j.places?.[0];
      if (hit?.id) console.log("places: fiche résolue →", hit.id, hit.displayName?.text);
      return hit?.id ?? null;
    } catch (e) {
      console.error("places searchText", e);
      return null;
    }
  },
  ["google-place-id"],
  { revalidate: 60 * 60 * 24 * 30 } // le place_id d'une fiche ne change pas
);

async function resolvePlaceId(key: string): Promise<string | null> {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  return resolvePlaceIdCached(key);
}

export async function googleRating(): Promise<GoogleRating> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.PLACES_API_KEY;
  if (!key) return FALLBACK;
  const placeId = await resolvePlaceId(key);
  if (!placeId) return FALLBACK;
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,googleMapsUri&key=${key}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) {
      console.error("places details", res.status);
      return FALLBACK;
    }
    const j = (await res.json()) as { rating?: number; userRatingCount?: number; googleMapsUri?: string };
    return {
      rating: typeof j.rating === "number" ? j.rating.toFixed(1).replace(".", ",") : FALLBACK.rating,
      count: typeof j.userRatingCount === "number" ? j.userRatingCount : FALLBACK.count,
      url: j.googleMapsUri ?? FALLBACK.url,
    };
  } catch (e) {
    console.error("places details", e);
    return FALLBACK;
  }
}
