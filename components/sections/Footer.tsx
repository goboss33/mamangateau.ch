"use client";

/* ---------------------------------------------------------------------------
   Contact / Footer — l'invitation finale, sur fond chocolat.
   La poussière d'or se rallume ici (mg:dust).
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { SITE, WA_DEFAULT, EMAIL_LINK } from "@/lib/data";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 70%",
      onEnter: () => window.dispatchEvent(new CustomEvent("mg:dust", { detail: 2 })),
      onLeaveBack: () => window.dispatchEvent(new CustomEvent("mg:dust", { detail: 0.5 })),
    });
    return () => st.kill();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden bg-chocolate">
      {/* Liseré d'or supérieur */}
      <div className="gold-rule" />

      <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-24 text-center md:pt-32">
        <p data-reveal className="eyebrow mb-6">Et maintenant ?</p>
        <p
          data-reveal
          className="font-script mx-auto max-w-3xl text-[clamp(2.7rem,8.5vw,5.2rem)] leading-[1.08] text-vanilla"
        >
          Racontez-moi
          <br />
          votre projet.
        </p>
        <p data-reveal className="mx-auto mt-6 max-w-md leading-relaxed text-vanilla/65">
          Une date, une envie, trois photos d'inspiration — c'est tout ce qu'il faut pour
          commencer. Je vous réponds personnellement.
        </p>

        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !bg-[#25D366]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.16L2.1 21.9l4.87-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.67a8.23 8.23 0 1 1-4.2 15.3l-.3-.18-2.89.89.9-2.82-.2-.31a8.23 8.23 0 0 1 6.7-12.88Zm-3.1 3.83c-.2 0-.5.07-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.77 1.17 2.96.14.19 2 3.05 4.83 4.15 2.35.93 2.83.74 3.34.7.5-.05 1.63-.67 1.86-1.32.23-.64.23-1.2.16-1.31-.07-.12-.26-.19-.55-.33-.28-.14-1.63-.8-1.88-.9-.25-.09-.44-.14-.62.14-.19.29-.72.9-.88 1.09-.16.19-.32.21-.6.07a7.5 7.5 0 0 1-2.2-1.36 8.27 8.27 0 0 1-1.53-1.9c-.16-.28-.02-.43.12-.57.13-.13.29-.33.43-.5.14-.16.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.62-1.5-.86-2.06-.22-.53-.45-.65-.62-.65h-.66Z" />
            </svg>
            Écrire sur WhatsApp
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-vanilla/25 px-7 py-3.5 font-semibold text-vanilla transition-all duration-300 hover:border-gold hover:text-gold-soft"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
            </svg>
            {SITE.instagramHandle}
          </a>
          <a
            href={EMAIL_LINK}
            className="inline-flex items-center gap-2.5 rounded-full border border-vanilla/25 px-7 py-3.5 font-semibold text-vanilla transition-all duration-300 hover:border-gold hover:text-gold-soft"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2.5" y="5" width="19" height="14" rx="3" />
              <path d="m3.5 7 7.2 5.4a2.2 2.2 0 0 0 2.6 0L20.5 7" />
            </svg>
            {SITE.email}
          </a>
        </div>

        <p data-reveal className="mt-6 text-xs text-vanilla/40">
          Réponse rapide par message — commandes idéalement 2 à 3 semaines à l'avance.
        </p>

        {/* Bas de page */}
        <div className="mt-20 border-t border-vanilla/10 pt-8 md:mt-24">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <p className="font-script text-2xl leading-none text-vanilla">Maman Gâteau</p>
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-vanilla/40">
                {SITE.tagline}
              </p>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-vanilla/60">
              <a href="/gateau-anniversaire-lausanne" className="transition-colors hover:text-gold-soft">Anniversaires</a>
              <a href="/gateau-mariage-lausanne" className="transition-colors hover:text-gold-soft">Mariage</a>
              <a href="/cupcakes-lausanne" className="transition-colors hover:text-gold-soft">Cupcakes</a>
              <a href="/creations" className="transition-colors hover:text-gold-soft">Le journal</a>
              <a href="/partenaires" className="transition-colors hover:text-gold-soft">Devenir partenaire</a>
              <a href="/#creations" className="transition-colors hover:text-gold-soft">Créations</a>
              <a href="/#configurateur" className="transition-colors hover:text-gold-soft">Composer</a>
              <a href="/#livraison" className="transition-colors hover:text-gold-soft">Livraison</a>
            </nav>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-vanilla/35">
            © {year} Maman Gâteau — Pully, Suisse · Gâteaux sur mesure pour Lausanne, la
            Riviera et le Grand Lausanne · Site réalisé avec amour
          </p>
        </div>
      </div>
    </footer>
  );
}
