import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const SITE_URL = "https://streetecon.io";
const SITE_NAME = "Street Economics";
const TITLE = "Street Economics — Built in Public";
const DESCRIPTION =
  "A community-driven ecosystem for cultural economics and growth mindset, built in public. Gathering the next generation of thinkers, builders, & earners. Access via Discord.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // og:image + twitter:image are generated from app/opengraph-image.png
  // (1200×630). metadataBase makes those URLs absolute for link scrapers.
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={anton.variable}>
      <body>
        {children}
        {/* Google tag (gtag.js) - GA4 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YK8BMZR9T9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YK8BMZR9T9');
          `}
        </Script>
      </body>
    </html>
  );
}
