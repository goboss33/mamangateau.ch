"use client";

/* ---------------------------------------------------------------------------
   Curseur maison (desktop uniquement, pointer:fine)
   Un seul disque, quasi collé au pointeur (aucune traînée) : il s'ouvre en
   halo doré sur les éléments interactifs et se comprime au clic.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='button'], label, input[type='range'], [data-cursor]";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const html = document.documentElement;
    html.classList.add("custom-cursor");

    const dot = dotRef.current!;
    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });

    /* Suivi quasi instantané : 80 ms de lissage, imperceptible comme latence */
    const x = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const y = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });

    let seen = false;
    let hovered = false;
    let pressed = false;

    const render = () => {
      const scale = pressed ? (hovered ? 2.0 : 0.8) : hovered ? 2.6 : 1;
      gsap.to(dot, {
        scale,
        backgroundColor: hovered ? "rgba(201,162,75,0.16)" : "rgba(74,44,32,0.9)",
        borderColor: hovered ? "rgba(201,162,75,0.75)" : "rgba(74,44,32,0)",
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const move = (e: PointerEvent) => {
      if (!seen) {
        seen = true;
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        gsap.to(dot, { opacity: 1, duration: 0.25 });
      }
      x(e.clientX);
      y(e.clientY);
    };

    const over = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(INTERACTIVE)) {
        hovered = true;
        render();
      }
    };
    const out = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(INTERACTIVE)) {
        hovered = false;
        render();
      }
    };
    const down = () => {
      pressed = true;
      render();
    };
    const up = () => {
      pressed = false;
      render();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    return () => {
      html.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-90 hidden [@media(pointer:fine)]:block" aria-hidden>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-3 w-3 rounded-full border"
        style={{ backgroundColor: "rgba(74,44,32,0.9)", borderColor: "transparent" }}
      />
    </div>
  );
}
