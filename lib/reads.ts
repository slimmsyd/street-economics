export type Read = {
  title: string;
  slug: string;
  /** Local path (e.g. /reads/xxx.png) or full https:// Substack cover_image URL */
  image: string;
};

const SUBSTACK_API = "https://streeteconomics.substack.com/api/v1/archive";

/**
 * Fetches the latest N posts from the Substack publication.
 * Returns them newest-first so index 0 is always the most recent drop.
 */
export async function getLatestReads(limit = 10): Promise<Read[]> {
  try {
    const url = `${SUBSTACK_API}?sort=new&offset=0&limit=${limit}`;
    const res = await fetch(url, {
      // Revalidate every hour. When a new post drops, the next visitor
      // (after the revalidate window) will see it automatically at position 1.
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Substack API ${res.status}`);

    const posts = (await res.json()) as any[];

    // Prefer our custom high-quality artwork for posts we have it for.
    // Newer posts that don't have local art will gracefully use the Substack cover image.
    const customImageFor: Record<string, string> = {
      "stop-playing-safe": "/reads/001_stop-playing-safe.png",
      "the-geometry-of-becoming": "/reads/002_the-geometry-of-becoming.webp",
      "the-pawn-king": "/reads/003_the-pawn-king.jpeg",
      "assets-and-ammo-a-framework-for-building": "/reads/004_assets-and-ammo-a-framework-for-building.png",
      "the-art-of-timing": "/reads/005_the-art-of-timing.png",
      "keep-stacking-wins": "/reads/006_keep-stacking-wins.jpeg",
      "the-unreasonable-man": "/reads/007_the-unreasonable-man.jpeg",
      "read-the-realm": "/reads/008_read-the-realm.jpeg",
      "how-to-think-and-grow-rich": "/reads/009_how-to-think-and-grow-rich.jpeg",
      "lifemaxxing": "/reads/010_lifemaxxing.png",
    };

    return posts.slice(0, limit).map((p) => {
      const slug = p.slug;
      const custom = customImageFor[slug];
      return {
        title: (p.title || "").trim(),
        slug,
        image: custom || p.cover_image || "",
      };
    });
  } catch (err) {
    console.warn("[reads] Falling back to static list:", err);
    return getStaticFallbackReads();
  }
}

/**
 * Hardcoded fallback (the original 10).
 * Used if the live fetch fails (build time, network, etc.).
 * This keeps the site working even if Substack API is down.
 */
export function getStaticFallbackReads(): Read[] {
  return [
    { title: "Stop Playing Safe", slug: "stop-playing-safe", image: "/reads/001_stop-playing-safe.png" },
    { title: "The Geometry of Becoming", slug: "the-geometry-of-becoming", image: "/reads/002_the-geometry-of-becoming.webp" },
    { title: "The Pawn-King", slug: "the-pawn-king", image: "/reads/003_the-pawn-king.jpeg" },
    { title: "Assets & Ammo: A Framework for Building Your Personal Economy", slug: "assets-and-ammo-a-framework-for-building", image: "/reads/004_assets-and-ammo-a-framework-for-building.png" },
    { title: "The Art of Timing", slug: "the-art-of-timing", image: "/reads/005_the-art-of-timing.png" },
    { title: "Keep Stacking Wins", slug: "keep-stacking-wins", image: "/reads/006_keep-stacking-wins.jpeg" },
    { title: "The Unreasonable Man", slug: "the-unreasonable-man", image: "/reads/007_the-unreasonable-man.jpeg" },
    { title: "Read The Realm", slug: "read-the-realm", image: "/reads/008_read-the-realm.jpeg" },
    { title: "How To Think & Grow Rich", slug: "how-to-think-and-grow-rich", image: "/reads/009_how-to-think-and-grow-rich.jpeg" },
    { title: "LifeMaxxing", slug: "lifemaxxing", image: "/reads/010_lifemaxxing.png" },
  ];
}
