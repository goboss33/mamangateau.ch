/* ---------------------------------------------------------------------------
   PageShell — enveloppe commune des pages internes (hors home)
   Reprend l'expérience de la home (Lenis, reveals, curseur, burger, bulle
   de contact, footer) sans le hero-canvas ni le preloader.
--------------------------------------------------------------------------- */

import Experience from "@/components/Experience";
import Navbar from "@/components/Navbar";
import ContactDial from "@/components/ContactDial";
import Footer from "@/components/sections/Footer";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Experience>
      <Navbar />
      <ContactDial />
      <main>{children}</main>
      <Footer />
    </Experience>
  );
}
