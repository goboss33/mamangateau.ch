import Experience from "@/components/Experience";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SugarDust from "@/components/SugarDust";
import Marquee from "@/components/Marquee";
import Hero from "@/components/sections/Hero";
import Histoire from "@/components/sections/Histoire";
import Rencontre from "@/components/sections/Rencontre";
import Difference from "@/components/sections/Difference";
import Portfolio from "@/components/sections/Portfolio";
import Configurateur from "@/components/sections/Configurateur";
import Temoignages from "@/components/sections/Temoignages";
import Livraison from "@/components/sections/Livraison";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <Experience>
      <Preloader />
      <CustomCursor />
      <SugarDust />
      <Navbar />
      <main>
        <Hero />
        <Histoire />
        <Rencontre />
        <Difference />
        <Marquee
          items={["Anniversaires", "Mariages", "Baby showers", "Événements d'entreprise"]}
        />
        <Portfolio />
        <Configurateur />
        <Temoignages />
        <Livraison />
      </main>
      <Footer />
    </Experience>
  );
}
