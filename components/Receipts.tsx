import Image from "next/image";
import { DISCORD_INVITE } from "@/lib/site";
import { RECEIPTS } from "@/lib/receipts";

const ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg"];

export default function Receipts() {
  return (
    <section id="receipts" className="receipts" aria-label="Proof of SE">
      <div className="receipts-inner">
        <div className="micro receipts-eyebrow">The Receipts</div>
        <h2 className="display receipts-title">PROOF OF SE</h2>
        <p className="serif-italic receipts-sub">we didn&rsquo;t write these</p>

        <div className="receipts-row">
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
