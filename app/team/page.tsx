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

type Member = { role: string; alias: string; image: string };

/** Full poster cards — role label, alias, and portrait are baked into each image. */
const TEAM: Member[] = [
  { role: "Founder || Architect", alias: "The Don", image: "/team/founder-the-don.jpg" },
  { role: "Engineer || CTO", alias: "Prompt", image: "/team/cto-prompt.jpg" },
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
            {TEAM.map((m) => (
              <article className="team-card" key={m.role}>
                <Image
                  className="team-card__img"
                  src={m.image}
                  alt={`${m.role} — ${m.alias}`}
                  width={1024}
                  height={1008}
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
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
