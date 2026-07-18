"use client";

/* Façade YouTube légère : la miniature seule au chargement (zéro script
   Google), l'iframe n'arrive qu'au clic. */

import { useState } from "react";

function videoId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/);
  return m?.[1] ?? null;
}

export default function YouTubeLite({ url, title }: { url: string; title: string }) {
  const [play, setPlay] = useState(false);
  const id = videoId(url);
  if (!id) return null;
  return (
    <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-3xl bg-chocolate/10">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} aria-label={`Lire la vidéo : ${title}`} className="group absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} className="h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-chocolate/85 text-vanilla shadow-lg transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 size-7"><path d="M8 5.5v13l11-6.5z" /></svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
