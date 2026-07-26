/* ---------------------------------------------------------------------------
   Note Google affichée sur le site — saisie dans Carnet → Réglages, servie
   par l'API des tarifs (cache 5 min, même appel que les prix).

   Pourquoi pas l'API Places : la fiche Google de Maman Gâteau est un
   établissement « zone de service », créé sans adresse publique. Ces fiches
   apparaissent dans Google Maps mais ne sont pas exposées dans l'index de
   l'API Places — aucune recherche ne les retrouve, ni par nom, ni par
   téléphone, ni via l'outil officiel de recherche d'identifiant. L'ancienne
   version interrogeait donc Places pour rien : elle échouait sans erreur
   (réponse vide, pas de code d'erreur) et retombait en silence sur des
   valeurs codées en dur, restées à 5 avis pendant que la fiche en comptait 9.

   Une saisie manuelle juste vaut mieux qu'un automatisme muet qui ment.
--------------------------------------------------------------------------- */

import { getTarifs } from "@/lib/tarifs";

export type GoogleRating = { rating: string; count: number; url: string };

const SEARCH_URL = "https://www.google.com/maps/search/?api=1&query=Maman+G%C3%A2teau+Pully";

/**
 * Note et nombre d'avis, prêts à afficher. Renvoie `null` tant qu'aucun avis
 * n'est renseigné : les composants savent se passer du bloc plutôt que
 * d'annoncer « 0 avis ».
 */
export async function googleRating(): Promise<GoogleRating | null> {
  const { google } = await getTarifs();
  if (!google.count) return null;
  return {
    rating: google.rating.toFixed(1).replace(".", ","),
    count: google.count,
    url: google.url || SEARCH_URL,
  };
}
