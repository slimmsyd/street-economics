"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/** YouTube clip, starts at 2:08 (208s), autoplays when the modal opens. */
const VIDEO_ID = "tkJZjB_-Lms";
const START_SECONDS = 208;
const EMBED_SRC =
  `https://www.youtube-nocookie.com/embed/${VIDEO_ID}` +
  `?start=${START_SECONDS}&autoplay=1&rel=0&modestbranding=1`;

export default function HeroDice() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Lock scroll, wire keyboard, move + restore focus while open.
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      // Minimal focus trap across the modal's focusable elements.
      const focusables = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="dice-card"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Roll the dice — play the CHA$E video"
      >
        <Image
          src="/uploads/CHASEBG.webp"
          alt="CHA$E drop 001 artwork — a pair of blue dice"
          width={1175}
          height={1338}
          priority
        />
        <span className="dice-card__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      <span className="serif-italic dice-tag">(roll the dice)</span>

      {open && (
        <div
          className="video-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={modalRef}
            className="video-modal"
            role="dialog"
            aria-modal="true"
            aria-label="CHA$E video"
          >
            <button
              ref={closeRef}
              type="button"
              className="video-close"
              onClick={close}
              aria-label="Close video"
            >
              CLOSE&nbsp;&times;
            </button>
            <div className="video-frame">
              <iframe
                src={EMBED_SRC}
                title="Street Economics — CHA$E"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
