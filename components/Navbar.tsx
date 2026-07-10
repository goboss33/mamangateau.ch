"use client";

/* ---------------------------------------------------------------------------
   Navbar — discrète pendant le hero, glisse en place une fois le dézoom joué.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LINKS = [
  { href: "#histoire", label: "L'histoire" },
  { href: "#creations", label: "Créations" },
  { href: "#temoignages", label: "Mots doux" },
  { href: "#livraison", label: "Livraison" },
];

export default function Navbar() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    gsap.set(el, { yPercent: -130 });
    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 1.4,
      onEnter: () => gsap.to(el, { yPercent: 0, duration: 0.8, ease: "power4.out" }),
      onLeaveBack: () => gsap.to(el, { yPercent: -130, duration: 0.6, ease: "power3.in" }),
    });
    return () => st.kill();
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 will-change-transform"
    >
      <nav className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-full border border-gold/20 bg-vanilla/80 py-2 pl-4 pr-2 shadow-[0_12px_40px_-18px_rgba(74,44,32,0.35)] backdrop-blur-md max-md:mx-3 md:mt-4 md:pl-6 md:pr-3">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Maman Gâteau — retour en haut">
          <Image src="/images/logo-kawaii.png" alt="" width={34} height={34} className="h-8 w-8 object-contain md:h-9 md:w-9" />
          <span className="font-script text-xl leading-none text-chocolate md:text-2xl">Maman Gâteau</span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-semibold text-chocolate/75 transition-colors hover:text-chocolate"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <a href="#configurateur" className="btn-primary !py-2.5 !pl-5 !pr-5 text-sm max-md:!pl-4 max-md:!pr-4">
          <span className="max-md:hidden">Composer mon gâteau</span>
          <span className="md:hidden">Composer</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </nav>
    </header>
  );
}
