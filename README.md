# Maman Gâteau — mamangateau.ch

Landing page immersive pour **Maman Gâteau**, cake designer à Pully (Lausanne & Riviera).
Direction artistique : voir [docs/BRAND.md](docs/BRAND.md) · Structure : [docs/BLUEPRINT.md](docs/BLUEPRINT.md).

## Stack

- **Next.js 15** (App Router, TypeScript) · **Tailwind CSS v4** · **GSAP + ScrollTrigger** · **Lenis** (smooth scroll) · **three.js** (poussière de sucre & confettis)
- Fonts auto-hébergées : Purgatory (script), GatteModern (titres), Quicksand variable (corps)

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
```

## L'expérience

1. **Préloader** — wordmark script + progression réelle du chargement des frames
2. **Hero** — dézoom « topper → gâteau » : 96 frames WebP peintes sur canvas, pilotées au scroll (desktop 16:9 + crop portrait mobile dédié). `prefers-reduced-motion` → image fixe
3. **Histoire** — timeline en 5 temps, fil d'or dessiné au scroll
4. **Rencontre** — écrin sombre pour la future interview vidéo (poussière d'or three.js)
5. **La différence** — manifeste en 3 piliers
6. **Créations** — galerie parallax (vraies photos)
7. **L'atelier** — configurateur 4 gestes → estimation indicative → WhatsApp prérempli
8. **Mots doux** — avis en notes scotchées
9. **Livraison** — carte stylisée de l'arc lémanique · **Footer** chocolat

## Régénérer les frames du hero

```bash
./scripts/extract-frames.sh assets-source/video/hero-2k.mp4 public/frames
```

## Déploiement (VPS + Docker + Nginx Proxy Manager)

Le site est conteneurisé (Next standalone, ~150 Mo, non-root, healthcheck).

```bash
# Sur le VPS
git clone <url-du-repo> mamangateau && cd mamangateau
docker network ls | grep -i npm            # repérer le réseau de NPM
NPM_NETWORK=<nom_du_réseau> docker compose up -d --build
```

Puis dans Nginx Proxy Manager : Proxy Host `mamangateau.ch` (+ `www`) →
`http://mamangateau:3000`, SSL Let's Encrypt + Force SSL + HTTP/2.

Redéployer après un changement :

```bash
git pull && NPM_NETWORK=<nom_du_réseau> docker compose up -d --build
```

## ⚠️ Avant la mise en ligne

- [ ] **Témoignages** : `lib/data.ts` → `TESTIMONIALS` contient des PLACEHOLDERS à remplacer par de vrais avis clients
- [ ] **Vidéo interview** : remplacer le placeholder de la section Rencontre le jour du tournage
- [ ] Vérifier le numéro WhatsApp dans `lib/data.ts` (`SITE.whatsappNumber`)
- [ ] Déploiement conseillé : Vercel (zéro config)

## Arborescence

```
app/            pages, layout, styles (design system dans globals.css)
components/     expérience globale + sections/
lib/            data.ts (contenus éditoriaux), gsap.ts
public/         fonts, frames du hero, images optimisées
assets-source/  sources brutes (vidéo, fonts, photos) — hors git pour le zip photos
docs/           BRAND.md, BLUEPRINT.md, moodboard
```
