"use client";

/* ---------------------------------------------------------------------------
   ContactDial — la bulle de contact (speed-dial)
   Un seul bouton chocolat en bas à droite (zone du pouce), qui apparaît
   d'un pop quand le hero sort de l'écran. Au tap, il déploie en éventail :
   Devis gratuit · WhatsApp · Instagram · E-mail, avec étiquettes.
   Le haut de l'écran reste au burger — chacun son coin.
--------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { SITE, WA_DEFAULT, EMAIL_LINK } from "@/lib/data";

const ITEMS = [
  {
    href: EMAIL_LINK,
    label: "E-mail",
    external: false,
    className: "border border-gold/35 bg-vanilla text-chocolate",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2.5" y="5" width="19" height="14" rx="3" />
        <path d="m3.5 7 7.2 5.4a2.2 2.2 0 0 0 2.6 0L20.5 7" />
      </svg>
    ),
  },
  {
    href: SITE.instagram,
    label: "Instagram",
    external: true,
    className: "border border-gold/35 bg-vanilla text-chocolate",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: WA_DEFAULT,
    label: "WhatsApp",
    external: true,
    className: "border border-gold/35 bg-vanilla text-[#25D366]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.16L2.1 21.9l4.87-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.67a8.23 8.23 0 1 1-4.2 15.3l-.3-.18-2.89.89.9-2.82-.2-.31a8.23 8.23 0 0 1 6.7-12.88Zm-3.1 3.83c-.2 0-.5.07-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.77 1.17 2.96.14.19 2 3.05 4.83 4.15 2.35.93 2.83.74 3.34.7.5-.05 1.63-.67 1.86-1.32.23-.64.23-1.2.16-1.31-.07-.12-.26-.19-.55-.33-.28-.14-1.63-.8-1.88-.9-.25-.09-.44-.14-.62.14-.19.29-.72.9-.88 1.09-.16.19-.32.21-.6.07a7.5 7.5 0 0 1-2.2-1.36 8.27 8.27 0 0 1-1.53-1.9c-.16-.28-.02-.43.12-.57.13-.13.29-.33.43-.5.14-.16.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.62-1.5-.86-2.06-.22-.53-.45-.65-.62-.65h-.66Z" />
      </svg>
    ),
  },
  {
    href: "#configurateur",
    label: "Devis gratuit",
    external: false,
    className: "border border-gold/40 bg-chocolate text-vanilla",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 20v-6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2V20" />
        <path d="M3.5 20h17" />
        <path d="M5 15.2c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" />
        <path d="M12 11.5V9M12 9a1.5 1.5 0 0 0 1.5-1.5C13.5 6 12 4.5 12 4.5S10.5 6 10.5 7.5A1.5 1.5 0 0 0 12 9Z" />
      </svg>
    ),
  },
];

export default function ContactDial() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const openRef = useRef(false);

  /* Apparition quand le hero sort de l'écran */
  useEffect(() => {
    const root = rootRef.current!;
    const reduced = prefersReducedMotion();
    gsap.set(root, { autoAlpha: 0, scale: reduced ? 1 : 0.4, y: reduced ? 0 : 18 });

    const hero = document.getElementById("top");
    const st = ScrollTrigger.create({
      trigger: hero ?? document.body,
      start: hero ? "bottom 72%" : () => window.innerHeight,
      onEnter: () =>
        gsap.to(root, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: reduced ? 0 : 0.55,
          ease: "back.out(2.2)",
        }),
      onLeaveBack: () => {
        close();
        gsap.to(root, {
          autoAlpha: 0,
          scale: reduced ? 1 : 0.4,
          y: reduced ? 0 : 18,
          duration: reduced ? 0 : 0.35,
          ease: "power2.in",
        });
      },
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animate = (target: boolean) => {
    const items = listRef.current!.querySelectorAll("[data-dial-item]");
    if (prefersReducedMotion()) {
      gsap.set(listRef.current, { autoAlpha: target ? 1 : 0 });
      return;
    }
    if (target) {
      gsap.set(listRef.current, { autoAlpha: 1 });
      gsap.fromTo(
        items,
        { y: 16, autoAlpha: 0, scale: 0.6 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, stagger: { each: 0.055, from: "end" }, ease: "back.out(1.9)" }
      );
    } else {
      gsap.to(items, {
        y: 12,
        autoAlpha: 0,
        scale: 0.7,
        duration: 0.22,
        stagger: { each: 0.03, from: "start" },
        ease: "power2.in",
        onComplete: () => gsap.set(listRef.current, { autoAlpha: 0 }),
      });
    }
  };

  const toggle = (next?: boolean) => {
    const target = next ?? !openRef.current;
    if (target === openRef.current) return;
    openRef.current = target;
    setOpen(target);
    animate(target);
  };
  const close = () => toggle(false);

  /* Fermeture : ESC ou clic à l'extérieur */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onClick = (e: MouseEvent) => {
      if (openRef.current && !rootRef.current!.contains(e.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 right-4 z-60 flex flex-col items-end gap-3 md:bottom-6 md:right-6"
      style={{ visibility: "hidden" }}
    >
      {/* Éventail */}
      <ul
        ref={listRef}
        className="flex flex-col items-end gap-2.5"
        style={{ visibility: "hidden" }}
        aria-hidden={!open}
      >
        {ITEMS.map((item) => (
          <li key={item.label} data-dial-item className="flex items-center gap-2.5">
            <span className="rounded-full bg-vanilla/95 px-3 py-1.5 text-xs font-semibold text-chocolate shadow-[0_8px_24px_-12px_rgba(74,44,32,0.45)] backdrop-blur-sm">
              {item.label}
            </span>
            <a
              href={item.href}
              onClick={close}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={item.label}
              tabIndex={open ? 0 : -1}
              className={`flex h-12 w-12 items-center justify-center rounded-full shadow-[0_12px_30px_-14px_rgba(74,44,32,0.5)] transition-transform duration-300 hover:scale-110 ${item.className}`}
            >
              {item.icon}
            </a>
          </li>
        ))}
      </ul>

      {/* Bouton principal */}
      <button
        type="button"
        onClick={() => toggle()}
        aria-expanded={open}
        aria-label={open ? "Fermer le menu de contact" : "Ouvrir le menu de contact"}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-chocolate text-vanilla shadow-[0_16px_38px_-16px_rgba(74,44,32,0.65)] transition-transform duration-300 hover:scale-105"
      >
        {/* Pulsation douce */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-gold/25 motion-safe:animate-[dialpulse_3.2s_ease-out_infinite]"
          aria-hidden
        />
        {/* Icône bulle-cœur ↔ croix */}
        <span className={`absolute transition-all duration-300 ${open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 11.3c0 4.1-4 7.4-9 7.4-.9 0-1.8-.1-2.6-.3L4 20l1.5-3.4A7 7 0 0 1 3 11.3C3 7.2 7 3.9 12 3.9s9 3.3 9 7.4Z" />
            <path d="M12 14.2s-2.8-1.8-2.8-3.7c0-.9.7-1.6 1.6-1.6.5 0 1 .3 1.2.7.2-.4.7-.7 1.2-.7.9 0 1.6.7 1.6 1.6 0 1.9-2.8 3.7-2.8 3.7Z" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className={`absolute transition-all duration-300 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </span>
      </button>

      <style>{`@keyframes dialpulse { 0% { transform: scale(1); opacity: 0.55; } 70%, 100% { transform: scale(1.55); opacity: 0; } }`}</style>
    </div>
  );
}
