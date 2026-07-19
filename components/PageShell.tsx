/* ---------------------------------------------------------------------------
   PageShell — enveloppe commune des pages internes (hors home)
   Reprend l'expérience de la home (Lenis, reveals, burger, bulle de contact,
   footer) sans le hero-canvas ni le preloader. Ajoute un wordmark cliquable
   en haut à gauche — le repère « retour accueil » absent de la home (où le
   hero tient déjà ce rôle).
--------------------------------------------------------------------------- */

import Link from "next/link";
import Experience from "@/components/Experience";
import HomeWordmark from "@/components/HomeWordmark";
import Navbar from "@/components/Navbar";
import ContactDial from "@/components/ContactDial";
import Footer from "@/components/sections/Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Experience>
      {/* Retour accueil — pastille « maison » sur mobile (lisible sur tout
          fond, jumelle du burger), wordmark script sur desktop */}
      <Link
        href="/"
        aria-label="Retour à l'accueil"
        className="fixed left-4 top-4 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gold/35 bg-vanilla/85 shadow-[0_10px_30px_-14px_rgba(74,44,32,0.45)] backdrop-blur-md transition-transform duration-300 hover:scale-105 md:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-chocolate/80">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9.2h13V10" />
        </svg>
      </Link>
      <HomeWordmark />
      <Navbar />
      <ContactDial />
      <main>{children}</main>
      <Footer />
    </Experience>
  );
}
