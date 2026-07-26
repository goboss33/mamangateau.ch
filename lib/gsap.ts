"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  /* Sur mobile, la barre d'adresse qui se rétracte au défilement change la
     hauteur de la fenêtre : ScrollTrigger y voit un redimensionnement et
     rafraîchit tout — en plein scroll, donc au milieu des animations en
     cours, qui mémorisent alors un état intermédiaire comme point de départ.
     Les sections sont en h-svh, cette hauteur-là ne bouge pas : rien à
     recalculer. */
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

/** Vrai si l'utilisateur préfère réduire les animations. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
