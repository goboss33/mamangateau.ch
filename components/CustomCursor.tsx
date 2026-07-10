"use client";

/* ---------------------------------------------------------------------------
   Curseur maison (desktop uniquement, pointer:fine)
   Point chocolat + halo doré qui s'étire vers les éléments interactifs.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='button'], label, input[type='range'], [data-cursor]";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const html = document.documentElement;
    html.classList.add("custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let seen = false;
    const move = (e: PointerEvent) => {
      if (!seen) {
        seen = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const over = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 1.8, backgroundColor: "rgba(201,162,75,0.12)", duration: 0.35 });
        gsap.to(dot, { scale: 0.5, duration: 0.35 });
      }
    };
    const out = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 1, backgroundColor: "rgba(201,162,75,0)", duration: 0.35 });
        gsap.to(dot, { scale: 1, duration: 0.35 });
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    return () => {
      html.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-90 hidden [@media(pointer:fine)]:block" aria-hidden>
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-10 w-10 rounded-full border border-gold/60"
      />
      <div ref={dotRef} className="fixed left-0 top-0 h-2 w-2 rounded-full bg-chocolate" />
    </div>
  );
}
