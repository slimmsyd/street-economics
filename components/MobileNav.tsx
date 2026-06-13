"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DISCORD_INVITE,
  DISCORD_INVITE_DISPLAY,
  INSTAGRAM_URL,
} from "@/lib/site";

type Active = "reads" | "access" | "community" | "team" | null;

const NAV = [
  { key: "reads", label: "READS", href: "/#drops" },
  { key: "access", label: "ACCESS", href: "/#access" },
  { key: "community", label: "COMMUNITY", href: "/#discord" },
  { key: "team", label: "TEAM", href: "/team" },
] as const;

/** Hamburger toggle (mobile only) + full-screen menu overlay. */
export default function MobileNav({ active = null }: { active?: Active }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

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
      const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button"
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
      toggleRef.current?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="mobile-menu__top">
            <Link
              href="/"
              className="display mobile-menu__wordmark"
              onClick={close}
            >
              STREETECONOMICS<sup>&reg;</sup>
            </Link>
            <button
              ref={closeRef}
              type="button"
              className="nav-close"
              aria-label="Close menu"
              onClick={close}
            >
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                <path
                  d="M5 5l14 14M19 5L5 19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu__links" aria-label="Mobile">
            {NAV.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                className={`display mobile-menu__link${
                  active === n.key ? " is-active" : ""
                }`}
                onClick={close}
                aria-current={active === n.key ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <a
            className="mobile-menu__cta"
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            JOIN THE DISCORD
          </a>

          <div className="mobile-menu__meta">
            <div className="mobile-menu__group">
              <div className="mobile-menu__head">Links /</div>
              <a
                className="footer-link"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="footer-link__icon" aria-hidden="true">
                  &rarr;
                </span>
                Instagram
              </a>
              <a
                className="footer-link"
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="footer-link__icon" aria-hidden="true">
                  &rarr;
                </span>
                Discord
              </a>
            </div>
            <div className="mobile-menu__group">
              <div className="mobile-menu__head">Address /</div>
              <p className="mobile-menu__text">
                GLOBAL
                <br />
                The server is the office.
              </p>
            </div>
            <div className="mobile-menu__group">
              <div className="mobile-menu__head">Contact /</div>
              <p className="mobile-menu__text">{DISCORD_INVITE_DISPLAY}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
