# Street Economics

Marketing site for **Street Economics** — a community-driven brand built in public, where the Discord server is the product. Built with **Next.js (App Router)** + TypeScript.

## Pages

- **`/`** — Home: editorial hero (with a "roll the dice" video lightbox), a READS carousel of the 10 most recent Substack articles, the Access privileges list, the directory, and the global footer.
- **`/team`** — The Street Team: dark-navy poster grid of six roles, a recruiting outro, and the global footer.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- `next/font` (Anton) · `next/image`
- Plain CSS design system in `app/globals.css` (tokens as CSS variables; no UI framework)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Structure

```
app/
  layout.tsx          # root layout, Anton font
  page.tsx            # Home
  team/page.tsx       # Team
  globals.css         # design system + all section styles
components/
  Masthead, Marquee, DiscordBadge, Footer   # shared across pages
  HeroDice            # hero card + YouTube video lightbox (client)
  DropsCarousel       # READS article carousel (client)
lib/site.ts           # shared constants (Discord invite, marquee copy, contact)
public/
  uploads/CHASEBG.webp
  reads/              # the 10 article covers shown in the READS carousel
```

## Editable constants

- **Discord invite** — `lib/site.ts` (`DISCORD_INVITE`), used by every "join" CTA.
- **READS articles** — `components/DropsCarousel.tsx` + `lib/reads.ts`. Dynamically fetches the 10 newest posts (newest first) from the Substack archive API at build time / on revalidation. When a new post is published it automatically becomes the first item in the carousel on the next data refresh. Falls back to a static list if the API is unavailable. Uses the post's Substack cover image.
- **Hero video** — `components/HeroDice.tsx` (`VIDEO_ID`, `START_SECONDS`).

## Pending brand assets

Six b&w team portraits (`/public/team`), real Instagram/TikTok URLs, and the Drop 002 / mascot artwork are intentional placeholders awaiting real assets.
