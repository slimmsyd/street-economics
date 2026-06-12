import { DISCORD_INVITE } from "@/lib/site";

/** Fixed bottom-right "join the discord" sticker. Global on every page. */
export default function DiscordBadge() {
  return (
    <a
      className="badge"
      href={DISCORD_INVITE}
      target="_blank"
      rel="noopener noreferrer"
    >
      join the
      <br />
      discord
    </a>
  );
}
