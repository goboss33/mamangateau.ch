"use client";

/* Partage d'un article — feuille native sur mobile (navigator.share),
   liens purs sans scripts tiers sur desktop. */

import { useEffect, useState } from "react";

const I = {
  share: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M4 12v7a1.8 1.8 0 0 0 1.8 1.8h12.4A1.8 1.8 0 0 0 20 19v-7" /><path d="M16 6.5 12 2.5l-4 4M12 2.5V15" /></svg>,
  wa: <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.8-5.1c-.6-1-.9-2-.9-2.7 0-.8.4-1.4.7-1.7.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2c.1.2.1.4 0 .6l-.4.6-.2.3c-.1.1-.2.3-.1.5.1.3.6 1 1.3 1.7a7 7 0 0 0 2 1.4c.2.1.4.1.5-.1l.7-.9c.2-.2.3-.3.6-.2l1.7.8c.3.2.5.2.5.4 0 .1 0 .7-.2 1.2Z" /></svg>,
  fb: <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.2c0-.8.3-1.4 1.5-1.4h1.4V5.2c-.3 0-1.1-.1-2-.1-2.1 0-3.6 1.3-3.6 3.7v2.3H8.3V14h2.4v7h2.8Z" /></svg>,
  pin: <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M12 2a10 10 0 0 0-3.7 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.5-4.4a4.7 4.7 0 0 0-4.9 4.7c0 .9.4 1.9.8 2.5.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.4.1-1.2-.6-2-2.4-2-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2Z" /></svg>,
  link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4"><path d="M10 14a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1" /><path d="M14 10a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="m4.5 12.5 5 5 10-11" /></svg>,
};

const btn =
  "inline-flex items-center gap-2 rounded-full border border-chocolate/20 bg-white/70 px-4 py-2 text-[13px] font-semibold text-cocoa transition-colors hover:border-chocolate/50 hover:text-chocolate";

export default function ShareRow({ title, path, image }: { title: string; path: string; image?: string }) {
  const [canNative, setCanNative] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = `https://mamangateau.ch${path}`;

  useEffect(() => {
    setCanNative(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* presse-papiers indisponible */ }
  };

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-chocolate/10 pt-6">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-widest text-grey-studio">Partager</span>
      {canNative ? (
        <button type="button" onClick={() => navigator.share({ title, url }).catch(() => null)} className={btn}>
          {I.share} Partager
        </button>
      ) : (
        <>
          <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noreferrer" className={btn}>{I.wa} WhatsApp</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={btn}>{I.fb} Facebook</a>
          {image && (
            <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image.startsWith("http") ? image : `https://mamangateau.ch${image}`)}&description=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" className={btn}>{I.pin} Pinterest</a>
          )}
        </>
      )}
      <button type="button" onClick={copy} className={btn}>
        {copied ? I.check : I.link} {copied ? "Copié !" : "Copier le lien"}
      </button>
    </div>
  );
}
