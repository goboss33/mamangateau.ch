# `data-nav-dark` — logo qui passe en vanille sur fond foncé

Le wordmark « Maman Gâteau » en haut à gauche des pages internes
(`components/HomeWordmark.tsx`) est **chocolat** par défaut et bascule en
**vanille** quand une section à fond foncé passe sous lui.

## Règle
Toute `<section>` à fond sombre (`bg-chocolate`, `bg-chocolate-deep`, ou une
image/vidéo foncée en plein cadre) qui apparaît en **haut de fenêtre** doit
porter l'attribut :

```jsx
<section className="… bg-chocolate …" data-nav-dark>
```

Sans cet attribut, le logo resterait chocolat sur le fond foncé et deviendrait
illisible.

## Sections déjà taguées
- `components/sections/Footer.tsx` — le pied de page (toujours chocolat)
- `components/pages/blocks.tsx` — le bloc CTA final des pages piliers (`LandingHero`)

## Ce qu'il ne faut PAS taguer
- Les fonds clairs (crème, vanille) — défaut chocolat, déjà lisible.
- Les petits éléments chocolat (boutons, puces) — seul le **fond de section** compte.
- Les sections de la home : la home n'affiche pas ce wordmark (le hero tient ce rôle).
