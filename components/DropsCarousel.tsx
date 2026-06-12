"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Street Economics — Substack publication base.
 * Per-post URLs are built as `${SUBSTACK_BASE}/p/${slug}`.
 * Change this single constant if the publication subdomain/domain differs.
 */
const SUBSTACK_BASE = "https://streeteconomics.substack.com";

type Read = {
  title: string;
  slug: string;
  file: string;
};

/**
 * 10 most recent articles (newest first), images in /public/reads.
 * Order verified against the Street Economics Substack RSS feed:
 * the scrape manifest is ordered newest-first, so items 001–010 are the latest.
 */
const reads: Read[] = [
  { title: "Stop Playing Safe", slug: "stop-playing-safe", file: "001_stop-playing-safe.png" },
  { title: "The Geometry of Becoming", slug: "the-geometry-of-becoming", file: "002_the-geometry-of-becoming.webp" },
  { title: "The Pawn-King", slug: "the-pawn-king", file: "003_the-pawn-king.jpeg" },
  { title: "Assets & Ammo: A Framework for Building Your Personal Economy", slug: "assets-and-ammo-a-framework-for-building", file: "004_assets-and-ammo-a-framework-for-building.png" },
  { title: "The Art of Timing", slug: "the-art-of-timing", file: "005_the-art-of-timing.png" },
  { title: "Keep Stacking Wins", slug: "keep-stacking-wins", file: "006_keep-stacking-wins.jpeg" },
  { title: "The Unreasonable Man", slug: "the-unreasonable-man", file: "007_the-unreasonable-man.jpeg" },
  { title: "Read The Realm", slug: "read-the-realm", file: "008_read-the-realm.jpeg" },
  { title: "How To Think & Grow Rich", slug: "how-to-think-and-grow-rich", file: "009_how-to-think-and-grow-rich.jpeg" },
  { title: "LifeMaxxing", slug: "lifemaxxing", file: "010_lifemaxxing.png" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function DropsCarousel() {
  const [index, setIndex] = useState(0);
  const total = reads.length;
  const i = ((index % total) + total) % total;
  const r = reads[i];
  const href = `${SUBSTACK_BASE}/p/${r.slug}`;

  return (
    <section id="drops" className="drops" aria-label="Recent reads">
      <div className="drops-grid">
        <div className="drop-card">
          <div className="drop-tag">RECENT — {pad(i + 1)} / {pad(total)}</div>
          <h2 className="display drop-headline">{r.title.toUpperCase()}</h2>
          <a
            className="drop-link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="drop-link__label">read the article</span>
            <span className="drop-link__icon" aria-hidden="true">
              &rarr;
            </span>
          </a>
          <div className="drop-foot">
            <span className="drop-foot__word">READS</span>
            <div className="drop-arrows">
              <button
                className="arrow-btn"
                type="button"
                onClick={() => setIndex((n) => n - 1)}
                aria-label="Previous article"
              >
                &larr;
              </button>
              <button
                className="arrow-btn"
                type="button"
                onClick={() => setIndex((n) => n + 1)}
                aria-label="Next article"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>

        <a
          className="drop-panel"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read: ${r.title}`}
        >
          <Image
            className="drop-panel__img"
            src={`/reads/${r.file}`}
            alt={`${r.title} — article cover`}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            priority
          />
          <span className="drop-status">READ ON SUBSTACK</span>
        </a>
      </div>
    </section>
  );
}
