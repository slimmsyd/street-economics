import {
  DISCORD_INVITE,
  DISCORD_INVITE_DISPLAY,
  INSTAGRAM_URL,
} from "@/lib/site";

/** Global footer — applied to every page. */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <a
            className="footer-cta"
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
          >
            JOIN THE DISCORD
          </a>

          <div className="footer-cols">
            <div className="footer-col-left">
              <div className="footer-group">
                <div className="footer-head">Links /</div>
                <div className="footer-links">
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
              </div>

              <div className="footer-group footer-group--server">
                <div className="footer-head">Join The Server /</div>
                <p className="footer-text">
                  Got a concept? Post it in #design-crits. We draft from inside
                  the server.
                </p>
                <a
                  className="footer-pill"
                  href={DISCORD_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Step Inside
                </a>
              </div>
            </div>

            <div className="footer-col-right">
              <div className="footer-group footer-group--meta">
                <div className="footer-head">Address /</div>
                <p className="footer-text footer-text--address">
                  GLOBAL
                  <br />
                  The server is the office.
                </p>
              </div>
              <div className="footer-group footer-group--meta">
                <div className="footer-head">Contact /</div>
                <p className="footer-text footer-text--contact">
                  {DISCORD_INVITE_DISPLAY}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-mark">
          <div className="display footer-wordmark">
            STREETECONOMICS<sup>&reg;</sup>
          </div>
          <div className="footer-legal">
            <span>© 2026 STREET ECONOMICS — ALL RIGHTS COMMUNITY-RESERVED</span>
            <span>FOR COMMUNITY PURPOSES ONLY&trade;</span>
            <span>c. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
