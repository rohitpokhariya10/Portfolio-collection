// Full-width project records progressively enhance into a sticky, desktop-only stack.
import { Fragment, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { profile, projects } from "@/data/portfolio";

const STICKY_TOP = 0;
const LEVEL_TICKS = 4;
const panelTones = ["cream", "sage", "coral"];
const clampProgress = (value) => Math.min(1, Math.max(0, value));

// Starting from the non-enhanced layout keeps prerendered and hydrated markup
// identical; the effect then opts capable viewports into desktop behavior.
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
};

const ProjectVisual = ({ project, index }) => {
  const rotation = index % 2 === 0 ? "-1.25deg" : "1.25deg";

  return (
    <figure
      className="project-panel__visual-frame"
      style={{ "--visual-rotation": rotation }}
    >
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} product screenshot`}
          className="project-panel__image"
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="project-panel__concept">
          <p className="utility-label">{project.concept.eyebrow}</p>
          <p className="project-panel__concept-title">
            {project.concept.title}
          </p>
          <div className="project-panel__concept-flow" aria-hidden="true">
            {project.concept.flow.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </div>
      )}

      <figcaption className="project-panel__visual-caption utility-label">
        {project.image
          ? `${project.title} / product interface`
          : `${project.title} / system scope`}
      </figcaption>
    </figure>
  );
};

const ProjectPanel = ({ active, index, isStacking, project }) => {
  const titleId = `${project.id}-title`;

  return (
    <article
      className={`project-panel project-panel--${panelTones[index % panelTones.length]} ${
        active ? "is-active" : ""
      }`}
      style={{ "--stack-z": index + 1 }}
      aria-labelledby={titleId}
      data-cursor="hover"
      data-reveal={isStacking ? undefined : "scale"}
    >
      <div className="page-shell project-panel__inner">
        <div className="project-panel__copy">
          <div className="project-panel__meta">
            <span className="utility-label">{project.number}</span>
            <span className="utility-label">{project.status}</span>
          </div>

          <p className="utility-label mt-6">
            {project.label}{project.timeline ? ` / ${project.timeline}` : ""}
          </p>
          <h3 id={titleId} className="project-panel__title mt-3">
            {project.title}
          </h3>
          <p className="project-panel__description mt-5">
            {project.description}
          </p>

          <ul
            className="project-panel__stack mt-6"
            aria-label={`${project.title} technology stack`}
          >
            {project.stack.map((item) => (
              <li key={item} className="skill-chip">
                {item}
              </li>
            ))}
          </ul>

          <ul className="project-panel__highlights mt-6">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          {project.links?.length ? (
            <nav
              className="project-panel__actions"
              aria-label={`${project.title} project links`}
            >
              <p className="project-panel__actions-label utility-label">
                <span className="project-panel__actions-pulse" aria-hidden="true" />
                Explore this project
              </p>
              <div className="project-panel__action-list">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`inline-link project-panel__action ${
                      link.label === "Live Demo"
                        ? "project-panel__action--primary"
                        : "project-panel__action--secondary"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} for ${project.title} (opens in a new tab)`}
                  >
                    <span>{link.label}</span>
                    <span className="project-panel__action-icon" aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </a>
                ))}
              </div>
            </nav>
          ) : null}
        </div>

        <ProjectVisual project={project} index={index} />
      </div>
    </article>
  );
};

const ProjectRail = ({ activeIndex, activeProgress, visible }) => {
  return (
    <nav
      className={`project-level-rail ${visible ? "is-visible" : ""}`}
      aria-label="Project navigation"
      aria-hidden={!visible}
    >
      <ol className="project-level-rail__levels">
        {projects.map((project, index) => {
          const levelProgress = index < activeIndex
            ? 1
            : index === activeIndex
              ? activeProgress
              : 0;

          return (
            <li
              key={project.id}
              className={`project-level-rail__level ${
                index < activeIndex ? "is-complete" : ""
              } ${index === activeIndex ? "is-active" : ""}`}
            >
              <a
                href={`#${project.id}`}
                className="project-level-rail__number"
                aria-label={`Jump to ${project.title}`}
                aria-current={activeIndex === index ? "location" : undefined}
                tabIndex={visible ? 0 : -1}
              >
                {project.number}
              </a>

              {index < projects.length - 1 && (
                <span className="project-level-rail__ladder" aria-hidden="true">
                  {Array.from({ length: LEVEL_TICKS }, (_, tickIndex) => {
                    const tickProgress = clampProgress(
                      levelProgress * LEVEL_TICKS - tickIndex,
                    );

                    return (
                      <span
                        key={tickIndex}
                        style={{ "--tick-progress": tickProgress.toFixed(3) }}
                      />
                    );
                  })}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const Projects = () => {
  const trackRef = useRef(null);
  const sentinelRefs = useRef([]);
  const reduceMotion = Boolean(useReducedMotion());
  const showDesktopRail = useMediaQuery("(min-width: 1024px)");
  const supportsStickyStack = useMediaQuery(
    "(min-width: 1024px) and (min-height: 700px)",
  );
  const isStacking = supportsStickyStack && !reduceMotion;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    // Sentinels remain in normal document flow while their corresponding panels
    // become sticky, giving the rail a stable source of scroll progress.
    const sentinels = sentinelRefs.current.filter(Boolean);
    let frameId = 0;

    const syncActivePanel = () => {
      const panelMetrics = sentinels
        .map((sentinel, index) => ({
          index,
          top: sentinel.getBoundingClientRect().top,
        }));
      const reachedPanels = panelMetrics.filter(
        (item) => item.top <= STICKY_TOP + 1,
      );
      const nextActiveIndex = reachedPanels.length
        ? reachedPanels[reachedPanels.length - 1].index
        : 0;
      const currentTop = panelMetrics[nextActiveIndex]?.top ?? STICKY_TOP;
      const nextTop = panelMetrics[nextActiveIndex + 1]?.top;
      const nextProgress = nextTop === undefined
        ? 1
        : clampProgress(
            (STICKY_TOP - currentTop) / Math.max(nextTop - currentTop, 1),
          );

      setActiveIndex(nextActiveIndex);
      setActiveProgress((currentProgress) =>
        Math.abs(currentProgress - nextProgress) > 0.002
          ? nextProgress
          : currentProgress,
      );
    };

    const requestSync = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        syncActivePanel();
        frameId = 0;
      });
    };

    syncActivePanel();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isStacking]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    // Keep the fixed rail out of both the visual and accessibility trees when
    // the project track is outside the viewport.
    const sectionObserver = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { rootMargin: `-${STICKY_TOP}px 0px -10% 0px`, threshold: 0 },
    );

    sectionObserver.observe(track);

    return () => sectionObserver.disconnect();
  }, []);

  return (
    <section
      id="projects"
      className="section-panel project-stack-section border-b-2 border-ink"
      aria-labelledby="projects-title"
    >
      <ProjectRail
        activeIndex={activeIndex}
        activeProgress={activeProgress}
        visible={showDesktopRail && sectionVisible}
      />

      <div className="page-shell">
        <div className="section-heading-grid">
          <div data-reveal>
            <p className="utility-label text-signal">Work / selected project proof</p>
            <h2 id="projects-title" className="section-title mt-4">
              StudyNotion leads with production depth.
            </h2>
          </div>

          <p
            className="section-copy"
            data-reveal
            style={{ "--reveal-delay": "90ms" }}
          >
            Two engineering-heavy builds spanning role-based access, real-time
            systems, transaction integrity, payments, automated testing,
            CI/CD, and AWS deployment.
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`project-stack-track mt-12 ${
          isStacking ? "is-stacking" : ""
        }`}
      >
        {projects.map((project, index) => (
          <Fragment key={project.id}>
            {/* The hash target must stay outside the sticky panel so native
                anchor navigation lands at the panel's true document position. */}
            <span
              id={project.id}
              className="project-panel-sentinel"
              data-project-index={index}
              ref={(node) => {
                sentinelRefs.current[index] = node;
              }}
              aria-hidden="true"
            />
            <ProjectPanel
              active={activeIndex === index}
              index={index}
              isStacking={isStacking}
              project={project}
            />
          </Fragment>
        ))}
      </div>

      <div className="page-shell">
        <div className="section-index" data-reveal>
          <p className="utility-label">Project records [ {projects.length} ]</p>
          <span className="divider-pattern" aria-hidden="true" />
          <a href={profile.github} className="inline-link">
            View GitHub <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
};
