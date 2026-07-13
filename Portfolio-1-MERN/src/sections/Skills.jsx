// Grouped skill proof instead of a flat keyword wall.
import { skillGroups } from "@/data/portfolio";

export const Skills = () => {
  return (
    <section id="skills" className="section-panel border-b border-border/70">
      <div className="page-shell">
        <div className="section-heading-grid">
          <div data-reveal>
            <p className="utility-label text-accent-ink">Skills / grouped stack</p>
            <h2 className="section-title mt-4">The stack behind the AI angle.</h2>
          </div>
          <p
            className="section-copy"
            data-reveal
            style={{ "--reveal-delay": "90ms" }}
          >
            Frontend, backend, data, AI integrations, and core CS fundamentals
            organized by how they show up in production work.
          </p>
        </div>

        <div className="skills-grid mt-12">
          {skillGroups.map((group, index) => (
            <article
              key={group.title}
              className="skill-card"
              data-reveal
              style={{ "--reveal-delay": `${index * 55}ms` }}
            >
              <p className="utility-label text-accent-ink">{group.title}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="skill-chip">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
