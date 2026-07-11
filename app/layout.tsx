import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/lib/data";

/* Quicksand auto-hébergée (variable 300-700) — zéro requête externe */
const quicksand = localFont({
  src: "../public/fonts/Quicksand-Variable.woff2",
  weight: "300 700",
  variable: "--font-quicksand",
  display: "swap",
});

const purgatory = localFont({
  src: "../public/fonts/Purgatory.woff2",
  variable: "--font-purgatory",
  display: "swap",
});

const gatte = localFont({
  src: "../public/fonts/GatteModern-Regular.woff2",
  variable: "--font-gatte",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: "Cake design à Lausanne : gâteaux sur mesure | Maman Gâteau",
  description:
    "Gâteaux d'anniversaire, de mariage et baby showers sur mesure par Annie, cheffe passée par une maison étoilée. Pully, Lausanne, Vevey, Montreux. Devis gratuit en ligne.",
  keywords: [
    "gâteau anniversaire Lausanne",
    "cake designer Lausanne",
    "gâteau sur mesure Pully",
    "gâteau anniversaire Vevey",
    "gâteau personnalisé Montreux",
    "gâteau baby shower Lausanne",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CH",
    url: SITE.domain,
    siteName: SITE.name,
    title: "Maman Gâteau — Créatrice de souvenirs",
    description:
      "Des gâteaux aussi beaux que délicieux, créés sur mesure à Pully pour Lausanne et la Riviera vaudoise.",
    images: [{ url: "/images/og-logo.png", width: 1200, height: 630, alt: "Maman Gâteau — cake design à Lausanne" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maman Gâteau — Créatrice de souvenirs",
    description:
      "Des gâteaux aussi beaux que délicieux, créés sur mesure à Pully pour Lausanne et la Riviera vaudoise.",
    images: ["/images/og-logo.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fdfbf7",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: SITE.name,
  description:
    "Cake designer sur mesure : gâteaux d'anniversaire, de mariage et d'événement, aussi beaux que délicieux.",
  url: SITE.domain,
  logo: `${SITE.domain}/images/logo-carre.png`,
  image: [`${SITE.domain}/images/og-logo.png`, `${SITE.domain}/images/og-cover.jpg`],
  telephone: "+41774401829",
  slogan: SITE.tagline,
  founder: { "@type": "Person", name: "Annie" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pully",
    addressRegion: "VD",
    addressCountry: "CH",
  },
  areaServed: [
    "Lausanne", "Pully", "Vevey", "Montreux", "Morges", "Renens",
    "Lutry", "Cully", "Écublens", "Crissier", "La Tour-de-Peilz",
  ].map((name) => ({ "@type": "City", name })),
  email: SITE.email,
  sameAs: [SITE.instagram],
  priceRange: "CHF 80 - CHF 150",
  servesCuisine: "Pâtisserie sur mesure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CH" className={`${quicksand.variable} ${purgatory.variable} ${gatte.variable}`}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
