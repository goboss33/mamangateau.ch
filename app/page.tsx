import Experience from "@/components/Experience";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import ContactDial from "@/components/ContactDial";
import SugarDust from "@/components/SugarDust";
import Marquee from "@/components/Marquee";
import Hero from "@/components/sections/Hero";
import Histoire from "@/components/sections/Histoire";
import Rencontre from "@/components/sections/Rencontre";
import Difference from "@/components/sections/Difference";
import Portfolio from "@/components/sections/Portfolio";
import JournalTeaser from "@/components/sections/JournalTeaser";
import Configurateur from "@/components/sections/Configurateur";
import Temoignages from "@/components/sections/Temoignages";
import Livraison from "@/components/sections/Livraison";
import Footer from "@/components/sections/Footer";
import { googleRating } from "@/lib/google";

// ISR : la home se régénère (avis Google + teaser Journal) et prend les
// nouvelles pages publiées ; le webhook Carnet la rafraîchit aussi à la volée.
export const revalidate = 3600;

export default async function Home() {
  const google = await googleRating();
  return (
    <Experience>
      <Preloader />
      <SugarDust />
      <Navbar />
      <ContactDial />
      <main>
        <Hero google={google} />
        <Histoire />
        <Rencontre />
        <Difference />
        <Marquee
          items={["Anniversaires", "Mariages", "Baby showers", "Événements d'entreprise"]}
        />
        <Portfolio />
        <JournalTeaser />
        <Configurateur />
        <Temoignages google={google} />
        <Livraison />
      </main>
      <Footer />
    </Experience>
  );
}
