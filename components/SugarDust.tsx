"use client";

/* ---------------------------------------------------------------------------
   SugarDust — three.js
   Un voile de sucre glace doré qui flotte dans la lumière. Presque invisible
   sur les fonds crème, il se révèle sur les sections sombres (Rencontre,
   Footer) dont l'intensité est pilotée par l'événement "mg:dust".
   Bonus : "mg:burst" déclenche une pluie de confettis sucrés (fin du
   configurateur). Désactivé si prefers-reduced-motion.
--------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/gsap";

const AMBIENT_DESKTOP = 620;
const AMBIENT_MOBILE = 260;
const BURST_POOL = 160;

export default function SugarDust() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mount = mountRef.current!;
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? AMBIENT_MOBILE : AMBIENT_DESKTOP;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      60
    );
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    /* ------------------------------------------------ texture ronde douce */
    const texCanvas = document.createElement("canvas");
    texCanvas.width = texCanvas.height = 64;
    const tctx = texCanvas.getContext("2d")!;
    const grad = tctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.8)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    tctx.fillStyle = grad;
    tctx.fillRect(0, 0, 64, 64);
    const softDot = new THREE.CanvasTexture(texCanvas);

    /* --------------------------------------------------- voile ambiant */
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      seeds[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.35 + Math.random() * 1.05;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const uniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0.5 },
      uTex: { value: softDot },
      uColorA: { value: new THREE.Color("#dbbf7e") }, // or doux
      uColorB: { value: new THREE.Color("#f6c9d4") }, // blush
    };

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms,
      vertexShader: /* glsl */ `
        attribute float aSeed;
        attribute float aSize;
        uniform float uTime;
        varying float vSeed;
        void main() {
          vSeed = aSeed;
          vec3 p = position;
          p.y += sin(uTime * 0.14 + aSeed) * 1.15;
          p.x += cos(uTime * 0.1 + aSeed * 1.7) * 0.9;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * 46.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        uniform float uIntensity;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vSeed;
        void main() {
          float tw = 0.55 + 0.45 * sin(uTime * 0.7 + vSeed * 3.0);
          vec3 col = mix(uColorA, uColorB, step(0.82, fract(vSeed)));
          vec4 tex = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(col, tex.a * tw * uIntensity * 0.5);
        }
      `,
    });
    scene.add(new THREE.Points(geo, mat));

    /* ------------------------------------------------- pool de confettis */
    const bPos = new Float32Array(BURST_POOL * 3);
    const bVel = new Float32Array(BURST_POOL * 3);
    const bLife = new Float32Array(BURST_POOL).fill(0);
    const bColor = new Float32Array(BURST_POOL * 3);
    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));
    bGeo.setAttribute("aColor", new THREE.BufferAttribute(bColor, 3));
    bGeo.setAttribute("aLife", new THREE.BufferAttribute(bLife, 1));
    const bMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTex: { value: softDot } },
      vertexShader: /* glsl */ `
        attribute vec3 aColor;
        attribute float aLife;
        varying vec3 vColor;
        varying float vLife;
        void main() {
          vColor = aColor;
          vLife = aLife;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (28.0 * aLife) / -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        varying vec3 vColor;
        varying float vLife;
        void main() {
          vec4 tex = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(vColor, tex.a * vLife);
        }
      `,
    });
    scene.add(new THREE.Points(bGeo, bMat));

    const palette = ["#c9a24b", "#f6c9d4", "#d9534f", "#b7ddc2", "#8fd0cf"].map(
      (c) => new THREE.Color(c)
    );

    const burst = () => {
      for (let i = 0; i < BURST_POOL; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        bPos[i * 3] = (Math.random() - 0.5) * 2;
        bPos[i * 3 + 1] = -2 + Math.random();
        bPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
        bVel[i * 3] = Math.cos(a) * speed * 0.55;
        bVel[i * 3 + 1] = 5.5 + Math.random() * 5.5;
        bVel[i * 3 + 2] = Math.sin(a) * speed * 0.3;
        bLife[i] = 1;
        const c = palette[i % palette.length];
        bColor[i * 3] = c.r;
        bColor[i * 3 + 1] = c.g;
        bColor[i * 3 + 2] = c.b;
      }
      bGeo.attributes.aColor.needsUpdate = true;
    };

    /* --------------------------------------------------------- pilotage */
    let targetIntensity = 0.5;
    const onDust = (e: Event) => {
      targetIntensity = (e as CustomEvent<number>).detail;
    };
    const onBurst = () => burst();
    window.addEventListener("mg:dust", onDust);
    window.addEventListener("mg:burst", onBurst);

    /* ------------------------------------------------------------ boucle */
    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value += dt;
      uniforms.uIntensity.value +=
        (targetIntensity - uniforms.uIntensity.value) * 0.04;

      let alive = false;
      for (let i = 0; i < BURST_POOL; i++) {
        if (bLife[i] <= 0) continue;
        alive = true;
        bLife[i] = Math.max(0, bLife[i] - dt * 0.55);
        bVel[i * 3 + 1] -= 9.5 * dt; // gravité
        bPos[i * 3] += bVel[i * 3] * dt;
        bPos[i * 3 + 1] += bVel[i * 3 + 1] * dt;
        bPos[i * 3 + 2] += bVel[i * 3 + 2] * dt;
      }
      if (alive) {
        bGeo.attributes.position.needsUpdate = true;
        bGeo.attributes.aLife.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    loop();

    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mg:dust", onDust);
      window.removeEventListener("mg:burst", onBurst);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
      geo.dispose();
      bGeo.dispose();
      mat.dispose();
      bMat.dispose();
      softDot.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden
    />
  );
}
