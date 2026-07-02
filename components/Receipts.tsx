"use client";

import { useRef } from "react";
import Image from "next/image";
import { DISCORD_INVITE } from "@/lib/site";
import { RECEIPTS } from "@/lib/receipts";

const ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg"];

export default function Receipts() {
  const rowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row || e.button !== 0) return;

    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: row.scrollLeft,
      moved: false,
    };
    row.setPointerCapture(e.pointerId);
    row.classList.add("receipts-row--dragging");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row || !dragRef.current.active) return;

    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 3) dragRef.current.moved = true;

    row.scrollLeft = dragRef.current.startScroll - dx;
    if (dragRef.current.moved) e.preventDefault();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row || !dragRef.current.active) return;

    dragRef.current.active = false;
    row.releasePointerCapture(e.pointerId);
    row.classList.remove("receipts-row--dragging");
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  return (
    <section id="receipts" className="receipts" aria-label="Proof of SE">
      <div className="receipts-inner">
        <div className="micro receipts-eyebrow">The Receipts</div>
        <h2 className="display receipts-title">PROOF OF SE</h2>
        <p className="serif-italic receipts-sub">we didn&rsquo;t write these</p>

        <div
          ref={rowRef}
          className="receipts-row"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          {RECEIPTS.map((receipt, index) => (
            <article
              className="receipt-card"
              key={receipt.image}
              style={{ transform: `rotate(${ROTATIONS[index % ROTATIONS.length]})` }}
            >
              <div
                className="receipt-card__img-wrap"
                style={receipt.aspect ? { aspectRatio: receipt.aspect } : undefined}
              >
                <Image
                  className="receipt-card__img"
                  src={receipt.image}
                  alt={receipt.alt}
                  fill
                  draggable={false}
                  sizes="(max-width: 560px) 86vw, (max-width: 1100px) 56vw, 480px"
                />
              </div>
              <span className="micro receipt-card__context">{receipt.context}</span>
            </article>
          ))}
        </div>

        <a
          className="pill pill--outline receipts-cta"
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
        >
          ADD YOURS <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
}