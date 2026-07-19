/* ---------------------------------------------------------------------------
   PageShell — enveloppe commune des pages internes (hors home)
   Reprend l'expérience de la home (Lenis, reveals, burger, bulle de contact,
   footer) sans le hero-canvas ni le preloader. Ajoute un wordmark cliquable
   en haut à gauche — le repère « retour accueil » absent de la home (où le
   hero tient déjà ce rôle).
--------------------------------------------------------------------------- */

import Link from "next/link";
import Experience from "@/components/Experience";
import Navbar from "@/components/Navbar";
import ContactDial from "@/components/ContactDial";
import Footer from "@/components/sections/Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Experience>
      <Link
        href="/"
        aria-label="Retour à l'accueil"
        className="font-script fixed left-6 top-6 z-40 text-2xl text-chocolate/85 transition-opacity hover:opacity-70 md:left-8 md:top-7"
      >
        Maman Gâteau
      </Link>
      <Navbar />
      <ContactDial />
      <main>{children}</main>
      <Footer />
    </Experience>
  );
}
