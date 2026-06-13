import Image from "next/image";
import Link from "next/link";
import DropsCarousel from "@/components/DropsCarousel";
import HeroDice from "@/components/HeroDice";
import Masthead from "@/components/Masthead";
import Marquee from "@/components/Marquee";
import DiscordBadge from "@/components/DiscordBadge";
import Footer from "@/components/Footer";
import { DISCORD_INVITE, HOME_MARQUEE } from "@/lib/site";

const PRIVILEGES = [
  { n: "01", label: "INSIDER ACCESS" },
  { n: "02", label: "BUSINESS OPPORTUNITIES" },
  { n: "03", label: "HIGH LEVEL NETWORKING" },
  { n: "04", label: "CREATIVE BLUEPRINTS" },
];

export default function Home() {
  return (
    <>
      {/* ============ MASTHEAD + HERO ============ */}
      <main id="top" className="hero">
        <Masthead variant="hero" />

        <div className="hero-grid">
          <div className="hero-col hero-col--left">
            <h1 className="display hero-headline">
              BUILT
              <br />
              IN PUBLIC
            </h1>
            <p className="hero-caption">
              A brand built in public, made with the people inside it.
            </p>
            <Link className="hero-cta" href="/questionnaire">
              TAKE THE QUESTIONNAIRE <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="hero-col hero-col--center">
            <HeroDice />
          </div>

          <div className="hero-col hero-col--right">
            <p className="hero-caption hero-caption--narrow hero-caption--start">
              We build drops worthy of obsession.
            </p>
            <h2 className="display hero-headline hero-headline--right">
              COMMUNITY
              <br />
              OWNED
            </h2>
            <p className="hero-caption hero-caption--narrow hero-caption--end">
              We turn a server full of strangers into a brand.
            </p>
          </div>
        </div>

        <div className="hero-strip micro">
          <span>FOR COMMUNITY PURPOSES ONLY&trade;</span>
          <span>GLOBAL</span>
        </div>
      </main>

      <DiscordBadge />

      <Marquee phrase={HOME_MARQUEE} />

      {/* ============ DROPS CAROUSEL ============ */}
      <DropsCarousel />

      {/* ============ ACCESS (inverted) ============ */}
      <section id="access" className="access" aria-label="Access & Privileges">
        <div className="access-grid">
          <ol className="privileges">
            {PRIVILEGES.map((p) => (
              <li className="privilege" key={p.n}>
                <span className="privilege__num">{p.n}</span>
                <span className="privilege__label">{p.label}</span>
              </li>
            ))}
          </ol>

          <div className="access-aside">
            <div className="access-aside__title">Access &amp; Privileges</div>
            <p className="access-aside__body">
              Membership is not merch-first. It is a seat at the table where the
              brand gets made — every voice counted, every voice heard, every
              invoice opened. Free to enter; contribution is the currency.
            </p>
            <div className="access-stat">
              <span className="display access-stat__num">230+</span>
              <span className="micro access-stat__label">
                Members across the globe
              </span>
            </div>
            <div className="access-art">
              <Image
                className="access-art__img"
                src="/uploads/chase-the-vision.jpg"
                alt="CHASE THE VISION — campaign artwork"
                fill
                sizes="(max-width: 800px) 100vw, 460px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ DIRECTORY ============ */}
      <section id="discord" className="directory" aria-label="The Server">
        <div className="directory-inner">
          <a className="dir-row" href="#drops">
            <span className="dir-row__meta">
              <span className="dir-row__num">01</span>
              <span className="dir-row__label">the work</span>
            </span>
            <span className="dir-row__word">READS</span>
          </a>

          <a className="dir-row" href="#access">
            <span className="dir-row__meta">
              <span className="dir-row__num">02</span>
              <span className="dir-row__label">the seat</span>
            </span>
            <span className="dir-row__word dir-row__word--hollow">ACCESS</span>
          </a>

          <a
            className="dir-row"
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="dir-row__meta">
              <span className="dir-row__num">03</span>
              <span className="dir-row__label">the server</span>
            </span>
            <span className="dir-row__word">DISCORD</span>
          </a>

          <div className="dir-strip micro">
            <span>SECTION 04 — &ldquo;THE SERVER&rdquo;</span>
            <span>FREE TO ENTER — CONTRIBUTION IS THE CURRENCY&trade;</span>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
