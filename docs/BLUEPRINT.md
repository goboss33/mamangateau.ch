# Maman Gâteau — Blueprint du site

Structure et intentions validées pour **mamangateau.ch**.
À lire avec [BRAND.md](BRAND.md).

---

## Structure générale

page d'accueil immersive (scrollytelling) + pages secondaires pour la profondeur SEO et fonctionnelle. 
Awwward winning style

- Accueil (immersive)
- À propos / Histoire d'Annie
- Créations / Portfolio
- Configurateur (devis)
- Pages locales SEO (villes prioritaires + page zone de livraison)
- Contact

---

## Vision de l'accueil

La hero section est une vidéo plein écran contrôllé par le scroll. Il s'agit d'un **Dézoom** partant du **topper doré « Maman Gâteau »** (le wordmark) jusqu'à révéler le **gâteau entier**. Geste « marque → produit » en une seule révélation.
La lecture est **pilotée par le scroll** (l'utilisateur contrôle le dézoom), sur une **distance de scroll assez courte** — l'effet doit se jouer dans les premières secondes, jamais donner la sensation de « scroller sur place ».
- À la fin du dézoom, la dernière frame (gâteau entier) devient le visuel du hero.
- La section suivante commence avec la couleur de fond de la vidéo, de façon à ce que l'utilisateur ne distingue aucune transition net entre la hero et le début de la 1ère section.
Les sections suivantes **continue en scroll normal** avec des sections classiques. Les transitions sont toujours bien travaillé et chaque section est une masterpiece


> Objectif : sensation immersive et « waouh » dès l'ouverture. Site Awwward winning style.

---

## Sections de l'accueil (ordre validé)

1. **Hero** — courte vidéo de dézoom (topper → gâteau entier) pilotée au scroll, tagline « Créatrice de souvenirs ». 
2. **Histoire d'Annie** — resserrée en **3 temps** type timeline : (2014-2016) formation de cheffe (Pérou), (2017-2019) travaillé comme cuisinière dans différents hôtels (melia hotel a punta cana puis AC Mariott à lima) (2020-2021) travail auprès d'un chef étoilé en France dans le sud ouest (2022) naissance de sa fille + le gâteau déclencheur de ses 1 an, (2023 - aujourd'hui) Maman Gâteau. Court, pas de scroll marathon une jolie timeline qui se dévoile au scrolling.
3. **Rencontre avec Annie** — section dédiée à une **vidéo interview face caméra** (à produire ; placeholder propre en attendant). Elle incarne l'histoire écrite — fort signal de confiance. La vidéo viens se placer par dessus la timeline précédente dans un jolie encadrement alors que le fond s'assombri.
4. **La différence** — 3 piliers : *beau ET délicieux* / *à l'écoute* / *un souvenir, pas un simple dessert*.
5. **Portfolio / Créations** — galerie, révélation au scroll, lien vers Instagram.
6. **Configurateur** — pièce maîtresse de conversion (voir ci-dessous).
7. **Témoignages** — avis client mis en forme de manière originale (pas un simple carousel).
8. **Zone de livraison** — 6 villes prioritaires + renvoi « et d'autres communes du Grand Lausanne ».
9. **Contact / Footer** — Instagram, WhatsApp, mentions légales, liens vers les pages villes.

---

## Configurateur (mécanique de conversion)

Interactif et ludique — c'est aussi l'élément le plus « awwwards » du site.

- Le client compose : **occasion → nombre d'invité → style → parfum → (option sans-gluten discrète)**.
- **Estimation de prix indicative en direct**, puis CTA vers devis / Instagram / WhatsApp.
- Reste un **point d'entrée vers un échange humain** (Annie travaille via Instagram DM + WhatsApp + email) — pas un tunnel e-commerce, chaque pièce étant unique.
- Prix repère : ~CHF 80–150 pour 15–20 parts.

---

## SEO local

**Angle** : vocabulaire grand public — « gâteau anniversaire [ville] » plutôt que « cake designer [ville] » (plus de volume de recherche particuliers).

**Villes prioritaires** (pages riches, contenu réellement local et différencié) :
Lausanne · Pully · Vevey · Montreux · Morges · Renens.

**Villes secondaires** (regroupées dans une **page unique « zone de livraison »** — pas de pages dupliquées par commune) :
Lutry, Paudex, Belmont, Cully, Savigny, Servion, Oron, Palézieux, La Tour-de-Peilz, Villeneuve, Echallens, Crissier, Ecublens, Saint-Prex, Aubonne, Froideville, Cugy, Bottens, Montpreveyres, Cossonay, La Sarraz.
*(Ouchy = quartier de Lausanne, à traiter en sous-mention dans la page Lausanne.)*

**Autres leviers** :
- Données structurées **schema.org LocalBusiness / Bakery** (avec `areaServed`).
- Metadata fr_CH, vitesse de chargement soignée malgré les animations.

---

## Contexte technique (décisions validées)

- **Framework** : Next.js + Tailwind CSS + three.js.
- **Français uniquement.**

## Assets disponibles

- Vidéo hero *hero-video-scroll-control.mp4* : court dézoom du topper doré « Maman Gâteau » vers le gâteau entier. 
- Logo + wordmark.
- Typo: non fournie - fonct adaptée à récupérer selon directives
- Images de référence / moodboard / palette
