/** Scrolling marquee band. Duplicated run for a seamless loop. */
export default function Marquee({ phrase }: { phrase: string }) {
  const run = phrase.repeat(4);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <span className="marquee__run">{run}</span>
        <span className="marquee__run">{run}</span>
      </div>
    </div>
  );
}
