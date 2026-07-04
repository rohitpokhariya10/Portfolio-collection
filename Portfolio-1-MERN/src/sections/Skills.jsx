// Full-width capability bands for the portfolio's strongest proof points.
// The flat color blocks create energy without animated skill meters.
import { capabilities } from "@/data/portfolio";

/**
 * Renders capability bands with one original sticker per band.
 */
export const Skills = () => {
  return (
    <section id="skills" className="border-b-2 border-ink">
      {capabilities.map((capability) => (
        <article
          key={capability.title}
          className={`${capability.colorClass} relative overflow-hidden border-b-2 border-ink py-14 last:border-b-0 md:py-20`}
        >
          <div className="page-shell grid gap-8 md:grid-cols-[minmax(0,0.68fr)_minmax(18rem,0.32fr)] md:items-center">
            <div>
              <p className="utility-label">Capability band</p>
              <h2 className="display-band mt-3 max-w-[9ch]">
                {capability.title}
              </h2>
              <p className="mt-7 max-w-3xl text-xl font-black leading-tight tracking-[-0.025em] md:text-3xl">
                {capability.proof}
              </p>
            </div>

            <aside
              className={`${capability.stickerColor} clip-corners relative rotate-3 border-2 border-ink p-4 shadow-[8px_8px_0_var(--color-ink)] md:-mr-8 md:-mt-14`}
            >
              <img
                src={capability.stickerImage}
                alt=""
                className="aspect-[4/3] w-full border-2 border-ink object-cover"
              />
              <p className="mt-4 font-mono text-xs font-bold leading-snug">
                {capability.sticker}
              </p>
            </aside>
          </div>
        </article>
      ))}
    </section>
  );
};
