import Image from "next/image";
import Link from "next/link";
import { DISCORD_INVITE } from "@/lib/site";
import MobileNav from "./MobileNav";

type Active = "reads" | "access" | "community" | "team" | "questionnaire" | null;

/**
 * Cream masthead: wordmark + pill nav. Shared across pages.
 * - variant "hero": sits at the top of the Home hero (no bottom padding).
 * - variant "page": standalone header above the marquee (Team page).
 */
export default function Masthead({
  active = null,
  variant = "page",
}: {
  active?: Active;
  variant?: "hero" | "page";
}) {
  return (
    <header className={`masthead${variant === "page" ? " masthead--page" : ""}`}>
      {variant === "page" && (
        <Image
          className="masthead__emblem"
          src="/uploads/se-logo.png"
          alt=""
          width={640}
          height={640}
          priority
          aria-hidden="true"
        />
      )}
      <Link href="/" className="display wordmark">
        STREETECONOMICS<sup>&reg;</sup>
      </Link>
      <nav className="nav" aria-label="Primary">
        <a className="pill pill--solid" href="/#drops">
          READS
        </a>
        <a className="pill pill--solid" href="/#access">
          ACCESS
        </a>
        <a className="pill pill--solid" href="/#discord">
          COMMUNITY
        </a>
        <Link
          className={`pill ${active === "team" ? "pill--outline" : "pill--solid"}`}
          href="/team"
          aria-current={active === "team" ? "page" : undefined}
        >
          TEAM
        </Link>
        <Link
          className={`pill ${active === "questionnaire" ? "pill--outline" : "pill--solid"}`}
          href="/questionnaire"
          aria-current={active === "questionnaire" ? "page" : undefined}
        >
          QUESTIONNAIRE
        </Link>
        <a
          className="pill pill--ghost"
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
        >
          JOIN THE DISCORD
        </a>
      </nav>
      <MobileNav active={active} />
    </header>
  );
}
