// Project showcase with one kinetic marquee, observer rail, and collage cards.
// The layout is loud, but the content stays grounded in real project records.
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile, projects } from "@/data/portfolio";

/**
 * Tracks which project card is currently most visible.
 * IntersectionObserver avoids manual scroll math and keeps the rail cheap.
 */
const useActiveProject = () => {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [isRailVisible, setIsRailVisible] = useState(false);

  useEffect(() => {
    const cards = document.querySelectorAll("[data-project-card]");
    const section = document.querySelector("#projects");

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveProject(visibleEntry.target.id);
        }
      },
      { rootMargin: "-20% 0px -25% 0px", threshold: [0.35, 0.55, 0.75] }
    );

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsRailVisible(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );

    cards.forEach((card) => observer.observe(card));
    if (section) {
      sectionObserver.observe(section);
    }

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return { activeProject, isRailVisible };
};

/**
 * Renders the single marquee moment requested by the direction.
 */
const ProjectMarquee = () => {
  const marqueeText = projects.map((project) => project.shortTitle).join(" / ");

  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-5 text-paper md:py-7">
      <div className="marquee-track gap-8 md:gap-12" aria-label={marqueeText}>
        {[0, 1].map((copy) => (
          <p
            key={copy}
            className="font-display text-[4.8rem] font-black uppercase leading-none tracking-[-0.045em] md:text-[9rem]"
            aria-hidden={copy === 1}
          >
            {marqueeText} /&nbsp;
          </p>
        ))}
      </div>
    </div>
  );
};

/**
 * Renders the desktop numbered rail and mobile dot rail from the same state.
 * @param {object} props
 * @param {string} props.activeProject - Project id currently highlighted.
 * @param {boolean} props.isRailVisible - Keeps the fixed rail out of non-project sections.
 */
const ProjectRail = ({ activeProject, isRailVisible }) => {
  return (
    <>
      <div
        className={`project-rail ${
          isRailVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Project index"
      >
        {projects.map((project) => (
          <a
            key={project.id}
            href={`#${project.id}`}
            className={`rail-button grid place-items-center ${
              activeProject === project.id ? "is-active" : ""
            }`}
            aria-label={`Jump to ${project.title}`}
          >
            {project.number}
          </a>
        ))}
      </div>

      <div className="mobile-rail" aria-label="Project progress">
        {projects.map((project) => (
          <a
            key={project.id}
            href={`#${project.id}`}
            className={`dot-button ${
              activeProject === project.id ? "is-active" : ""
            }`}
            aria-label={`Jump to ${project.title}`}
          />
        ))}
      </div>
    </>
  );
};

/**
 * Renders a single collage card. Concept entries are text slips, not fake
 * screenshots, so every image that appears is a real local asset.
 * @param {object} props
 * @param {object} props.project - Project record to display.
 */
const ProjectCollageCard = ({ project }) => {
  return (
    <article
      id={project.id}
      data-project-card
      className="collage-card h-full scroll-mt-24 p-4 md:p-5"
      style={{
        "--tilt": project.tilt,
        "--mobile-tilt": project.mobileTilt,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="utility-label text-signal">
            {project.number} / {project.status}
          </p>
          <h3 className="mt-2 font-display text-5xl font-black uppercase leading-[0.82] tracking-[-0.04em] md:text-7xl">
            {project.title}
          </h3>
        </div>
        <span className="pill h-10 px-3 font-mono text-xs font-bold">
          {project.label}
        </span>
      </div>

      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          className="mt-5 aspect-video w-full border-2 border-ink object-cover"
        />
      ) : (
        <div className="mt-5 grid min-h-[15rem] place-items-center border-2 border-ink bg-band-butter p-6 text-center">
          <p className="font-display text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em]">
            Concept slip:
            <br />
            compliance tracker
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1fr]">
        <div>
          <p className="utility-label">Problem</p>
          <p className="mt-2 text-lg font-bold leading-tight">{project.problem}</p>
        </div>
        <div>
          <p className="utility-label">Built</p>
          <p className="mt-2 text-base leading-snug text-muted">{project.built}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="border-2 border-ink px-2.5 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.06em]"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-5 border-l-4 border-signal pl-3 font-mono text-xs font-bold leading-snug">
        {project.note}
      </p>
    </article>
  );
};

/**
 * Renders the complete project area: marquee, active rail, collage grid, and
 * utility footer.
 */
export const Projects = () => {
  const { activeProject, isRailVisible } = useActiveProject();

  return (
    <section id="projects" className="relative border-b-2 border-ink">
      <ProjectMarquee />
      <ProjectRail
        activeProject={activeProject}
        isRailVisible={isRailVisible}
      />

      <div className="page-shell py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
        <div data-reveal>
          <p className="utility-label">Project collage / real screenshots only</p>
          <h2 className="display-section mt-4">Work that can be inspected.</h2>
        </div>
          <p className="body-large" data-reveal style={{ "--reveal-delay": "90ms" }}>
            Biggest card first because full-stack EdTech is most relevant for
            the roles I’m chasing. The concept card stays honest: no screenshot
            until there is a screenshot.
          </p>
        </div>

        <div className="mt-14 grid auto-rows-auto grid-cols-1 gap-8 md:grid-cols-12 md:gap-9">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={project.span}
              data-reveal="scale"
              style={{ "--reveal-delay": `${index * 80}ms` }}
            >
              <ProjectCollageCard project={project} />
            </div>
          ))}
        </div>

        <div
          className="mt-16 grid gap-4 border-y-2 border-ink py-5 md:grid-cols-[1fr_auto_1fr] md:items-center"
          data-reveal
        >
          <p className="utility-label">Project index [ {projects.length} ]</p>
          <span className="divider-pattern" aria-hidden="true" />
          <a
            href={profile.github}
            className="utility-label inline-flex items-center gap-2 hover:-translate-y-0.5 hover:text-signal md:justify-end"
          >
            View all projects <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
};
