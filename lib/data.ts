/* ---------------------------------------------------------------------------
   Maman Gâteau — Données du site
   Toutes les constantes éditoriales au même endroit.
--------------------------------------------------------------------------- */

export const SITE = {
  name: "Maman Gâteau",
  tagline: "Créatrice de souvenirs",
  domain: "https://mamangateau.ch",
  instagram: "https://www.instagram.com/maman.gateau.suisse/",
  instagramHandle: "@maman.gateau.suisse",
  whatsappNumber: "41774401829", // format international sans +
  email: "mamangateau.ch@gmail.com",
  city: "Pully",
  region: "Lausanne & Riviera vaudoise",
} as const;

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const EMAIL_LINK = `mailto:${SITE.email}?subject=${encodeURIComponent(
  "Demande de gâteau sur mesure"
)}`;

export const WA_DEFAULT = waLink(
  "Bonjour Annie ! Je découvre mamangateau.ch et j'aimerais discuter d'un gâteau sur mesure. 🎂"
);

/* ------------------------------------------------------------ timeline */

export type Milestone = {
  years: string;
  title: string;
  text: string;
  icon: "toque" | "hotel" | "star" | "heart" | "cake";
};

export const TIMELINE: Milestone[] = [
  {
    years: "2014 — 2016",
    title: "L'école de la rigueur",
    text: "Je me forme comme cheffe de cuisine au Pérou, mon pays natal. La technique d'abord, la passion toujours.",
    icon: "toque",
  },
  {
    years: "2017 — 2019",
    title: "Les grandes maisons",
    text: "Cuisinière au Meliá de Punta Cana, puis à l'AC Marriott de Lima : j'y apprends l'exigence des palaces, service après service.",
    icon: "hotel",
  },
  {
    years: "2020 — 2021",
    title: "Aux côtés d'un chef étoilé",
    text: "Dans le Sud-Ouest de la France, j'affine mon geste auprès d'un chef étoilé. Le goût du détail devient une seconde nature.",
    icon: "star",
  },
  {
    years: "2022",
    title: "La révélation",
    text: "Ma fille naît. Pour son premier anniversaire, je crée mon tout premier gâteau — et je découvre, par amour, une nouvelle façon d'exercer mon art.",
    icon: "heart",
  },
  {
    years: "2023 — aujourd'hui",
    title: "Maman Gâteau",
    text: "À Pully, je crée aujourd'hui des pièces uniques pour vos plus beaux moments. Cheffe un jour, créatrice de souvenirs pour toujours.",
    icon: "cake",
  },
];

/* ------------------------------------------------------------ piliers */

export const PILLARS = [
  {
    title: "Beau et délicieux",
    script: "l'un ne va pas sans l'autre",
    text: "Beaucoup de jolis gâteaux déçoivent à la première bouchée. Formée en gastronomie et passée par les cuisines d'un chef étoilé, je travaille le goût avec la même exigence que le décor.",
  },
  {
    title: "À l'écoute, vraiment",
    script: "votre histoire d'abord",
    text: "Chaque création commence par une conversation. L'occasion, les couleurs, les souvenirs que vous voulez raviver : je dessine votre gâteau autour de ce qui compte pour vous.",
  },
  {
    title: "Un souvenir, pas un dessert",
    script: "ce qui reste, quand tout est mangé",
    text: "Le gâteau est au centre de la photo, au centre de la table, au centre du moment. Mon métier : que l'on s'en souvienne longtemps après la dernière part.",
  },
] as const;

/* ------------------------------------------------------ configurateur */

export const OCCASIONS = [
  { id: "anniversaire-enfant", label: "Anniversaire d'enfant", emoji: "🧁" },
  { id: "anniversaire-adulte", label: "Anniversaire d'adulte", emoji: "🥂" },
  { id: "mariage", label: "Mariage", emoji: "💍" },
  { id: "baby-shower", label: "Baby shower", emoji: "🍼" },
  { id: "entreprise", label: "Événement d'entreprise", emoji: "🎊" },
  { id: "autre", label: "Autre occasion", emoji: "✨" },
] as const;

export const STYLES = [
  { id: "floral", label: "Élégant & floral", desc: "fleurs fraîches ou en sucre, lignes épurées" },
  { id: "kawaii", label: "Mignon & ludique", desc: "personnages, couleurs douces, sourires garantis" },
  { id: "minimal", label: "Minimaliste chic", desc: "lignes nettes, palette sobre, effet couture" },
  { id: "drip", label: "Drip gourmand", desc: "coulures de chocolat, généreux et spectaculaire" },
  { id: "semi-naked", label: "Semi-naked", desc: "crème fine, biscuit apparent, esprit champêtre" },
  { id: "theme", label: "Thème personnalisé", desc: "votre univers — décrivez-le, montrez-le" },
] as const;

/* ------------------------------------------------------------- goûts */

export const BISCUITS = [
  { id: "vanille", label: "Vanille" },
  { id: "chocolat", label: "Chocolat" },
  { id: "citron", label: "Citron" },
  { id: "cannelle", label: "Cannelle" },
  { id: "orange", label: "Orange" },
  { id: "nature", label: "Nature" },
] as const;

export type Fourrage = { id: string; label: string; sup: number };

export const FOURRAGES: readonly Fourrage[] = [
  { id: "ganache-noir", label: "Ganache chocolat noir", sup: 0 },
  { id: "ganache-lait", label: "Ganache chocolat lait", sup: 0 },
  { id: "ganache-blanc", label: "Ganache chocolat blanc", sup: 0 },
  { id: "creme-vanille", label: "Crème vanille", sup: 0 },
  { id: "creme-fruits-rouges", label: "Crème fruits rouges", sup: 0 },
  { id: "creme-fraise", label: "Crème fraise", sup: 0 },
  { id: "creme-framboise", label: "Crème framboise", sup: 8 },
  { id: "creme-noisettes", label: "Crème noisettes", sup: 8 },
  { id: "creme-oreo", label: "Crème Oreo & mascarpone", sup: 8 },
  { id: "creme-caramel", label: "Crème caramel beurre salé", sup: 8 },
  { id: "coulis", label: "Coulis fraise, framboise ou fruits rouges", sup: 10 },
  { id: "fruits-frais", label: "Fruits frais (selon saison)", sup: 10 },
];

export const MAX_FOURRAGES = 2;

/* ------------------------------------------------------------- extras */

export type Extra = { id: string; label: string; price: number; hint: string };

export const EXTRAS: readonly Extra[] = [
  { id: "cupcakes-6", label: "Boîte de 6 cupcakes", price: 24, hint: "assortis à votre gâteau" },
  { id: "mini-cupcakes-12", label: "Boîte de 12 mini-cupcakes", price: 28, hint: "format bouchée, parfait en sweet table" },
];

/* ------------------------------------------------------- tarification */

export const TIER2 = { surcharge: 25, minParts: 26, maxParts: 60 } as const;

export const DELIVERY = {
  origin: "Pully, Suisse",
  freeKm: 10,
  chfPerKm: 1,
} as const;

type PriceBand = { max: number; price: number };

/** Prix « beau décor » par nombre de parts (1 étage), dégressif — édite les valeurs ici.
    Un seul prix affiché (pas de fourchette) : c'est la norme, Annie confirme.
    2 étages = ce prix + TIER2.surcharge. */
export const PRICE_BANDS: { default: PriceBand[]; mariage: PriceBand[] } = {
  default: [
    { max: 15, price: 100 },
    { max: 19, price: 125 },
    { max: 25, price: 145 },
    { max: 30, price: 185 },
    { max: 34, price: 210 },
    { max: 40, price: 235 },
    { max: 50, price: 270 },
    { max: 60, price: 305 },
  ],
  mariage: [
    { max: 15, price: 165 },
    { max: 19, price: 200 },
    { max: 25, price: 245 },
    { max: 30, price: 295 },
    { max: 34, price: 330 },
    { max: 40, price: 375 },
    { max: 50, price: 430 },
    { max: 60, price: 490 },
  ],
};

const bandsFor = (occasion?: string | null) =>
  occasion === "mariage" ? PRICE_BANDS.mariage : PRICE_BANDS.default;

/** Plancher : jamais une part en dessous de ce prix (CHF), arrondi aux 5.- supérieurs. */
export const MIN_PART_PRICE = 7;

/** Prix du gâteau : tranche dégressive selon les parts, plancher à MIN_PART_PRICE/part,
    + supplément si 2 étages. */
export function cakeBase(parts: number, tiers: 1 | 2, occasion?: string | null): number {
  const bands = bandsFor(occasion);
  const band = bands.find((b) => parts <= b.max) ?? bands[bands.length - 1];
  const floor = Math.ceil((parts * MIN_PART_PRICE) / 5) * 5;
  return Math.max(band.price, floor) + (tiers === 2 ? TIER2.surcharge : 0);
}

/** Estimation finale (prix unique) = gâteau + suppléments fourrage + extras + livraison. */
export function estimateTotal(opts: {
  parts: number;
  tiers: 1 | 2;
  fourrages: string[];
  deliveryFee: number | null; // null = à confirmer
  occasion?: string | null;
  extras?: Record<string, number>; // id -> quantité
}): { price: number; sup: number; extrasTotal: number } {
  const base = cakeBase(opts.parts, opts.tiers, opts.occasion);
  const sup = opts.fourrages.reduce(
    (acc, id) => acc + (FOURRAGES.find((f) => f.id === id)?.sup ?? 0),
    0
  );
  const extrasTotal = Object.entries(opts.extras ?? {}).reduce(
    (acc, [id, qty]) => acc + (EXTRAS.find((e) => e.id === id)?.price ?? 0) * qty,
    0
  );
  const fee = opts.deliveryFee ?? 0;
  return { price: base + sup + extrasTotal + fee, sup, extrasTotal };
}

/* -------------------------------------------------------- témoignages */
/* ⚠️ PLACEHOLDERS rédigés d'après les retours récurrents (« beau ET bon »,
   « à l'écoute ») décrits dans docs/BRAND.md. À REMPLACER par de vrais avis
   clients (Instagram / WhatsApp) avant la mise en ligne. */

export const TESTIMONIALS = [
  {
    quote: "Le gâteau était magnifique, mais alors le goût… nos invités en parlent encore !",
    author: "Claire",
    context: "anniversaire 30 ans, Lausanne",
    rotate: -2.5,
  },
  {
    quote: "Annie a compris exactement ce que j'avais en tête, avec trois photos et deux messages.",
    author: "Sofia",
    context: "baby shower, Pully",
    rotate: 1.8,
  },
  {
    quote: "Aussi beau que délicieux. On a gardé le topper en souvenir, ma fille l'a accroché dans sa chambre.",
    author: "Mélanie",
    context: "premier anniversaire, Vevey",
    rotate: -1.4,
  },
  {
    quote: "Commande passée un peu tard, réponse en dix minutes, résultat au-delà de nos espérances.",
    author: "David",
    context: "surprise d'équipe, Morges",
    rotate: 2.2,
  },
] as const;

/* ------------------------------------------------------------- villes */

export type City = { name: string; x: number; y: number; home?: boolean };

export const CITIES_PRIMARY: readonly City[] = [
  { name: "Lausanne", x: 34, y: 40 },
  { name: "Pully", x: 42, y: 46, home: true },
  { name: "Morges", x: 12, y: 47 },
  { name: "Renens", x: 17, y: 29 },
  { name: "Vevey", x: 72, y: 58 },
  { name: "Montreux", x: 84, y: 66 },
];

export const CITIES_SECONDARY = [
  "Lutry", "Paudex", "Belmont", "Cully", "Savigny", "Oron", "Échallens",
  "Crissier", "Écublens", "Saint-Prex", "La Tour-de-Peilz", "Villeneuve",
  "Cossonay", "Aubonne",
] as const;

/* ---------------------------------------------------------- portfolio */
/* Visuels : vraies créations d'Annie (voir public/images/portfolio).      */

export type PortfolioItem = {
  src: string;
  alt: string;
  label: string;
  ratio: "portrait" | "square" | "tall";
  speed: number; // vitesse de parallax (1 = normal)
};

export const PORTFOLIO: PortfolioItem[] = [
  { src: "/images/portfolio/creation-01.webp", alt: "Gâteau cœur rose pastel couronné d'or", label: "Anniversaire", ratio: "portrait", speed: 1 },
  { src: "/images/portfolio/creation-02.webp", alt: "Château de princesse rose et or à étages", label: "Conte de fées", ratio: "tall", speed: 0.82 },
  { src: "/images/portfolio/creation-03.webp", alt: "Gâteau licorne pastel", label: "Sur thème", ratio: "square", speed: 1.12 },
  { src: "/images/portfolio/creation-04.webp", alt: "Gâteau chocolat et framboises fraîches", label: "Gourmandise", ratio: "portrait", speed: 0.9 },
  { src: "/images/portfolio/creation-05.webp", alt: "Gâteau à étages or et palmiers pour 40 ans", label: "Grande occasion", ratio: "tall", speed: 1.06 },
  { src: "/images/portfolio/creation-06.webp", alt: "Gâteau bleu façon toile de Jouy", label: "Toile de Jouy", ratio: "square", speed: 0.86 },
  { src: "/images/portfolio/creation-07.webp", alt: "Gâteau safari à étages pour enfant", label: "Pour les petits", ratio: "portrait", speed: 1.1 },
  { src: "/images/portfolio/creation-08.webp", alt: "Gâteau à étages aux roses violettes en sucre", label: "Fleurs en sucre", ratio: "square", speed: 0.95 },
];
