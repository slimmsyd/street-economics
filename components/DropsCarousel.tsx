"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

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

// Brand-consistent easing — a confident "wipe" curve, not a bounce.
const EASE = [0.65, 0, 0.35, 1] as const;

export default function DropsCarousel() {
  const reduce = useReducedMotion();
  // Track the active index alongside the direction of the last move so the
  // slide/reveal animations know which way to travel (+1 = next, -1 = prev).
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  const total = reads.length;
  const i = ((index % total) + total) % total;
  const r = reads[i];
  const href = `${SUBSTACK_BASE}/p/${r.slug}`;

  const paginate = (dir: number) => setIndex(([n]) => [n + dir, dir]);

  // ----- Image panel: directional horizontal wipe (crossfade if reduced) -----
  const panelVariants: Variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-100%" }),
        center: { x: "0%" },
        exit: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%" }),
      };

  // ----- Text block: masked vertical reveal with a small stagger -----
  const textGroup: Variants = {
    center: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const textItem: Variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, y: "110%" },
        center: { opacity: 1, y: "0%" },
        exit: { opacity: 0, y: "-110%" },
      };

  return (
    <section id="drops" className="drops" aria-label="Recent reads">
      <div className="drops-grid">
        <motion.div
          className="drop-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={i}
              className="drop-anim"
              variants={textGroup}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <motion.div className="drop-mask">
                <motion.div
                  className="drop-tag"
                  variants={textItem}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  RECENT — {pad(i + 1)} / {pad(total)}
                </motion.div>
              </motion.div>

              <motion.div className="drop-mask">
                <motion.h2
                  className="display drop-headline"
                  variants={textItem}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  {r.title.toUpperCase()}
                </motion.h2>
              </motion.div>

              <motion.div
                className="drop-mask drop-mask--inline"
                variants={textItem}
                transition={{ duration: 0.45, ease: EASE }}
              >
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
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="drop-foot">
            <span className="drop-foot__word">READS</span>
            <div className="drop-arrows">
              <motion.button
                className="arrow-btn"
                type="button"
                onClick={() => paginate(-1)}
                aria-label="Previous article"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                &larr;
              </motion.button>
              <motion.button
                className="arrow-btn"
                type="button"
                onClick={() => paginate(1)}
                aria-label="Next article"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                &rarr;
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.a
          className="drop-panel"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read: ${r.title}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={i}
              className="drop-panel__slide"
              custom={direction}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Image
                className="drop-panel__img"
                src={`/reads/${r.file}`}
                alt={`${r.title} — article cover`}
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <span className="drop-status">READ ON SUBSTACK</span>
        </motion.a>
      </div>
    </section>
  );
}
