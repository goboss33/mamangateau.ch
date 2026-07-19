"use client";

/* ---------------------------------------------------------------------------
   Wordmark « retour accueil » (desktop, pages internes).
   Couleur de marque exacte selon le fond : chocolat par défaut, VANILLE
   quand une section à fond foncé passe sous lui.

   ┌─────────────────────────────────────────────────────────────────────┐
   │ IMPORTANT — pour qu'une NOUVELLE section à fond chocolat fasse        │
   │ passer le logo en vanille, il faut lui ajouter l'attribut :          │
   │        data-nav-dark                                                  │
   │ (sur l'élément <section> qui porte bg-chocolate / bg-chocolate-deep). │
   │ Voir docs/NAV-DARK.md. Sans l'attribut, le logo reste chocolat.       │
   └─────────────────────────────────────────────────────────────────────┘

   Zéro calcul au scroll : un IntersectionObserver ne se déclenche que
   lorsqu'une section taguée franchit la ligne du logo (~44 px du haut).
--------------------------------------------------------------------------- */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINE = 44; // centre vertical du wordmark, en px depuis le haut

export default function HomeWordmark() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const active = new Set<Element>();
    let io: IntersectionObserver | null = null;

    const build = () => {
      io?.disconnect();
      active.clear();
      const h = window.innerHeight;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) active.add(e.target);
            else active.delete(e.target);
          }
          setDark(active.size > 0);
        },
        { rootMargin: `-${LINE}px 0px -${Math.max(0, h - LINE - 1)}px 0px`, threshold: 0 }
      );
      document.querySelectorAll("[data-nav-dark]").forEach((el) => io!.observe(el));
    };

    // léger différé : laisse le DOM de la nouvelle page se monter
    const t = window.setTimeout(build, 60);
    window.addEventListener("resize", build);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", build);
      io?.disconnect();
    };
  }, [pathname]);

  return (
    <Link
      href="/"
      aria-label="Retour à l'accueil"
      className="font-script fixed left-8 top-7 z-40 hidden text-2xl transition-colors duration-300 hover:opacity-70 md:block"
      style={{ color: dark ? "var(--color-vanilla)" : "var(--color-chocolate)" }}
    >
      Maman Gâteau
    </Link>
  );
}
