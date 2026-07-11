"use client";

/* ---------------------------------------------------------------------------
   Menu — bouton flottant + prise d'écran totale
   Pas de barre sticky : un seul bouton rond en haut à droite. À l'ouverture,
   une onde blush puis crème se déploie en clip-path circulaire depuis le
   bouton, les liens montent en cascade masquée, le wordmark script veille
   en filigrane. ESC, clic sur un lien ou sur la croix pour refermer.
--------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SITE, WA_DEFAULT, EMAIL_LINK } from "@/lib/data";

const LINKS = [
  { href: "#histoire", label: "L'histoire" },
  { href: "#rencontre", label: "La rencontre" },
  { href: "#creations", label: "Créations" },
  { href: "#configurateur", label: "Composer mon gâteau" },
  { href: "#temoignages", label: "Mots doux" },
  { href: "#livraison", label: "Livraison" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(false);

  useEffect(() => {
    const overlay = overlayRef.current!;
    const reduced = prefersReducedMotion();

    const origin = "calc(100% - 42px) 42px";
    gsap.set([veilRef.current, panelRef.current], {
      clipPath: `circle(0px at ${origin})`,
    });
    gsap.set(overlay, { visibility: "hidden" });

    const items = overlay.querySelectorAll("[data-menu-item]");
    const foot = overlay.querySelectorAll("[data-menu-foot]");
    gsap.set(items, { yPercent: 130 });
    gsap.set(foot, { autoAlpha: 0, y: 18 });

    const tl = gsap.timeline({ paused: true });
    if (reduced) {
      tl.set(overlay, { visibility: "visible" })
        .set([veilRef.current, panelRef.current], { clipPath: `circle(150vmax at ${origin})` })
        .set(items, { yPercent: 0 })
        .set(foot, { autoAlpha: 1, y: 0 });
    } else {
      tl.set(overlay, { visibility: "visible" })
        .to(veilRef.current, {
          clipPath: `circle(150vmax at ${origin})`,
          duration: 0.75,
          ease: "power3.inOut",
        }, 0)
        .to(panelRef.current, {
          clipPath: `circle(150vmax at ${origin})`,
          duration: 0.75,
          ease: "power3.inOut",
        }, 0.14)
        .to(items, {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.055,
          ease: "power4.out",
        }, 0.42)
        .to(foot, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
        }, 0.7);
    }
    tlRef.current = tl;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openRef.current) toggle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (next?: boolean) => {
    const target = next ?? !openRef.current;
    openRef.current = target;
    setOpen(target);

    const tl = tlRef.current;
    if (!tl) return;

    if (target) {
      document.documentElement.style.overflow = "hidden";
      tl.timeScale(1).play();
      gsap.to(line1Ref.current, { rotate: 45, y: 4, duration: 0.35, ease: "power2.inOut" });
      gsap.to(line2Ref.current, { rotate: -45, y: -4, duration: 0.35, ease: "power2.inOut" });
    } else {
      document.documentElement.style.overflow = "";
      tl.timeScale(1.6).reverse();
      gsap.to([line1Ref.current, line2Ref.current], {
        rotate: 0,
        y: 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => toggle()}
        aria-expanded={open}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className="fixed right-4 top-4 z-80 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gold/35 bg-vanilla/85 shadow-[0_10px_30px_-14px_rgba(74,44,32,0.45)] backdrop-blur-md transition-transform duration-300 hover:scale-105 md:right-6 md:top-6"
      >
        <span className="relative block h-3 w-5">
          <span ref={line1Ref} className="absolute left-0 top-0 block h-[1.8px] w-full rounded bg-chocolate" />
          <span ref={line2Ref} className="absolute bottom-0 left-0 block h-[1.8px] w-full rounded bg-chocolate" />
        </span>
      </button>

      {/* Prise d'écran */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        data-lenis-prevent
        className="fixed inset-0 z-70"
        style={{ visibility: "hidden" }}
      >
        {/* Onde blush */}
        <div ref={veilRef} className="absolute inset-0 bg-blush" />
        {/* Panneau crème */}
        <div ref={panelRef} className="absolute inset-0 overflow-y-auto bg-cream">
          {/* Filigrane */}
          <span
            className="font-script pointer-events-none absolute -right-10 bottom-[4vh] hidden select-none text-[11rem] leading-none text-gold/10 lg:block"
            aria-hidden
          >
            Maman Gâteau
          </span>
          {/* Grain discret local */}
          <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-2.5 md:left-8 md:top-7">
            <span className="font-script text-2xl text-chocolate/80">Maman Gâteau</span>
          </div>

          <nav className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-8 py-28 md:px-10">
            <ol>
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <a
                    href={l.href}
                    onClick={() => toggle(false)}
                    data-menu-item
                    className="group flex items-baseline gap-4 py-[0.55rem] will-change-transform md:gap-6"
                  >
                    <span className="w-7 shrink-0 text-right font-display text-sm text-gold/80 transition-colors group-hover:text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display relative text-[clamp(1.9rem,6vw,3rem)] leading-[1.12] text-chocolate transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:text-cocoa">
                      {l.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" aria-hidden />
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24"
                      className="ml-auto shrink-0 self-center text-gold opacity-0 transition-all duration-400 group-hover:opacity-100"
                      aria-hidden
                    >
                      <path
                        d="M12 2c.7 4.5 2.3 7.2 3.4 8.4 1.2 1.2 3.9 2.7 8.6 3.6-4.7.9-7.4 2.4-8.6 3.6-1.1 1.2-2.7 3.9-3.4 8.4-.7-4.5-2.3-7.2-3.4-8.4C7.4 16.4 4.7 14.9 0 14c4.7-.9 7.4-2.4 8.6-3.6C9.7 9.2 11.3 6.5 12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ol>

            {/* Pied de menu */}
            <div className="mt-12 border-t border-gold/25 pt-7">
              <div data-menu-foot className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <a
                  href={WA_DEFAULT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-chocolate transition-colors hover:text-cocoa"
                >
                  <span className="h-2 w-2 rounded-full bg-[#25D366]" aria-hidden />
                  WhatsApp
                </a>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-chocolate transition-colors hover:text-cocoa"
                >
                  <span className="h-2 w-2 rounded-full bg-blush-deep" aria-hidden />
                  Instagram
                </a>
                <a
                  href={EMAIL_LINK}
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-chocolate transition-colors hover:text-cocoa"
                >
                  <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
                  E-mail
                </a>
                <span className="text-sm text-grey-studio">Pully · Lausanne · Riviera</span>
              </div>
              <p data-menu-foot className="script-accent mt-5 text-2xl">
                {SITE.tagline}
              </p>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
