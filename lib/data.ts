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
  { id: "gourmand", label: "Généreusement gourmand", desc: "coulis, fruits, chocolat — l'appel direct" },
  { id: "theme", label: "Thème sur mesure", desc: "votre univers, fidèlement recréé" },
] as const;

export const FLAVOURS = [
  { id: "vanille-framboise", label: "Vanille & framboise" },
  { id: "chocolat-praline", label: "Chocolat & praliné" },
  { id: "citron-meringue", label: "Citron meringué" },
  { id: "fraise", label: "Fraises & crème" },
  { id: "exotique", label: "Passion & mangue" },
  { id: "a-definir", label: "À définir ensemble" },
] as const;

/** Estimation indicative : CHF 80–150 pour 15–20 parts (voir BRAND.md). */
export function estimatePrice(guests: number): { from: number; to: number } {
  const base = 80;
  const from = Math.max(base, Math.round((guests * 5.2) / 5) * 5);
  const to = Math.round((from * 1.45) / 5) * 5;
  return { from, to };
}

export function buildWhatsAppMessage(opts: {
  occasion?: string;
  guests: number;
  style?: string;
  flavour?: string;
  glutenFree: boolean;
  date?: string;
}): string {
  const lines = [
    "Bonjour Annie ! 🎂",
    "Je viens de composer mon gâteau sur mamangateau.ch :",
    opts.occasion ? `• Occasion : ${opts.occasion}` : null,
    `• Invités : environ ${opts.guests}`,
    opts.style ? `• Style : ${opts.style}` : null,
    opts.flavour ? `• Parfum : ${opts.flavour}` : null,
    opts.glutenFree ? "• Version sans gluten souhaitée" : null,
    opts.date ? `• Date envisagée : ${opts.date}` : null,
    "",
    "Pouvez-vous me dire si c'est réalisable et m'envoyer une estimation ?",
  ].filter(Boolean);
  return lines.join("\n");
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
