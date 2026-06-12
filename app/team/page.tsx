import type { Metadata } from "next";
import Image from "next/image";
import Masthead from "@/components/Masthead";
import Marquee from "@/components/Marquee";
import DiscordBadge from "@/components/DiscordBadge";
import Footer from "@/components/Footer";
import { DISCORD_INVITE, TEAM_MARQUEE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Street Economics — The Street Team",
  description:
    "No org chart, no suits. A handful of members who got handed the keys — and a server full of people who run the place. Every face answers to the vote.",
};

type Member = { role: string; image: string | null };

/**
 * Roles only — no names on the posters (final intent).
 * `image` stays null until real b&w portraits land in /public/team.
 */
const TEAM: Member[] = [
  { role: "Founder || First Poster", image: null },
  { role: "Creative Director", image: null },
  { role: "Drop Captain", image: null },
  { role: "Head Mod", image: null },
  { role: "Production Lead", image: null },
  { role: "Ledger Keeper || Open Books", image: null },
];

export default function TeamPage() {
  return (
    <>
      <Masthead variant="page" active="team" />
      <Marquee phrase={TEAM_MARQUEE} />

      {/* ============ TEAM POSTERS (dark navy) ============ */}
      <section id="team" className="team" aria-label="The Street Team">
        <div className="team-inner">
          <div className="team-head">
            <h1 className="display team-title">THE STREET TEAM</h1>
            <p className="team-intro">
              No org chart, no suits. A handful of members who got handed the
              keys — and a server full of people who actually run the place.
              Every face below answers to the vote.
            </p>
          </div>

          <div className="team-grid">
            {TEAM.map((m, i) => (
              <article className="team-card" key={i}>
                {m.image ? (
                  <Image
                    className="team-card__img"
                    src={m.image}
                    alt={m.role}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                ) : (
                  <div className="team-card__placeholder" aria-hidden="true">
                    <span className="team-card__note">[ b&amp;w portrait ]</span>
                  </div>
                )}
                <span className="team-card__role">{m.role}</span>
              </article>
            ))}
          </div>

          <div className="team-strip micro">
            <span>SECTION 05 — &ldquo;THE PEOPLE&rdquo;</span>
            <span>ELECTED BY THE SERVER&trade;</span>
          </div>
        </div>
      </section>

      <DiscordBadge />

      {/* ============ RECRUITING OUTRO (cream) ============ */}
      <section className="recruit" aria-label="Join the bench">
        <div className="recruit-inner">
          <div className="recruit-lead">
            <h2 className="display recruit-title">
              YOUR NAME
              <br />
              COULD BE HERE
            </h2>
            <p className="recruit-text">
              Roles get filled from inside the server. Show up in #design-crits,
              ship something, get drafted.
            </p>
          </div>
          <a
            className="drop-link"
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="drop-link__label">step inside</span>
            <span className="drop-link__icon" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
