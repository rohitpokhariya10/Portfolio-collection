// Progressive hero: the document stays complete while motion decorates the visual intro.
import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { SiGmail, SiLeetcode } from "react-icons/si";
import { ParticleText } from "@/Components/ParticleText";
import { profile, proofStats } from "@/data/portfolio";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => {
  const progress = clamp01(value);
  return progress * progress * (3 - 2 * progress);
};

export const Hero = ({ particleActive = true }) => {
  const particleScrollRef = useRef(null);
  const particleStageRef = useRef(null);

  useEffect(() => {
    const scrollZone = particleScrollRef.current;
    const stage = particleStageRef.current;

    if (!scrollZone || !stage) {
      return undefined;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    let frameId = 0;

    // CSS owns the layout; this effect only publishes scroll-derived opacity tokens.
    // Compact and reduced-motion environments use a short fade instead of a pinned zoom.
    const updateParticleIntro = () => {
      frameId = 0;
      const isPinnedZoom = !motionQuery.matches && !compactQuery.matches;
      const bounds = scrollZone.getBoundingClientRect();
      const scrollDistance = isPinnedZoom
        ? Math.max(1, scrollZone.offsetHeight - window.innerHeight)
        : Math.max(1, window.innerHeight * 0.72);
      const progress = clamp01(-bounds.top / scrollDistance);
      const motionOpacity = isPinnedZoom
        ? 1 - smoothstep((progress - 0.86) / 0.14)
        : 1 - smoothstep(progress);
      const interfaceOpacity = isPinnedZoom
        ? 1 - smoothstep(progress / 0.18)
        : motionOpacity;

      stage.style.setProperty(
        "--particle-motion-opacity",
        motionOpacity.toFixed(4),
      );
      stage.style.setProperty(
        "--particle-ui-opacity",
        interfaceOpacity.toFixed(4),
      );
    };

    // Coalesce scroll and resize bursts into one layout read per animation frame.
    const requestIntroUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateParticleIntro);
      }
    };

    updateParticleIntro();
    window.addEventListener("scroll", requestIntroUpdate, { passive: true });
    window.addEventListener("resize", requestIntroUpdate);
    motionQuery.addEventListener?.("change", requestIntroUpdate);
    compactQuery.addEventListener?.("change", requestIntroUpdate);

    return () => {
      window.removeEventListener("scroll", requestIntroUpdate);
      window.removeEventListener("resize", requestIntroUpdate);
      motionQuery.removeEventListener?.("change", requestIntroUpdate);
      compactQuery.removeEventListener?.("change", requestIntroUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section
      className="hero-section relative overflow-x-clip border-b border-border/70"
      aria-labelledby="home-page-title"
    >
      <h1 id="home-page-title" className="sr-only" tabIndex={-1}>
        {profile.name} — {profile.role}
      </h1>

      <div
        ref={particleScrollRef}
        className="hero-particle-scroll"
        data-hero-scroll-zone
      >
        <div
          ref={particleStageRef}
          className="hero-particle-stage"
          style={{
            backgroundColor: "var(--color-ink)",
          }}
        >
          <div className="hero-particle-stage__motion">
            <div
              className="hero-particle-stage__meta page-shell utility-label"
              style={{ color: "rgb(247 241 232 / 72%)" }}
              aria-hidden="true"
            >
              <span>Identity / particle field</span>
              <span className="hero-particle-stage__status">
                <span
                  className="hero-particle-stage__status-dot"
                  style={{ backgroundColor: "#8bf0be" }}
                />
                Interactive / move cursor
              </span>
            </div>
            <ParticleText
              text={profile.shortName}
              active={particleActive}
              scrollContainerRef={particleScrollRef}
            />
            <div
              className="hero-particle-stage__scroll utility-label"
              style={{
                borderColor: "rgb(247 241 232 / 24%)",
                backgroundColor: "rgb(20 20 20 / 88%)",
                color: "rgb(247 241 232 / 86%)",
                boxShadow: "0 0 2rem rgb(179 38 30 / 18%)",
              }}
              aria-hidden="true"
            >
              <span>Scroll to portfolio</span>
              <ArrowDown
                color="var(--color-signal)"
                size={15}
                strokeWidth={2.25}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell">
        <div className="grid content-between gap-8 py-8 md:py-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(17rem,0.35fr)] lg:items-center lg:gap-12">
            <div className="hero-intro-copy min-w-0">
              <p className="utility-label text-accent-ink" data-reveal>
                {profile.name}
              </p>

              <h2
                className="hero-role-title mt-4"
                data-reveal="line"
                style={{ "--reveal-delay": "80ms" }}
              >
                <span>AI Full</span>
                <span>Stack</span>
                <span>Developer</span>
              </h2>

              <p
                className="hero-subline mt-5"
                data-reveal
                style={{ "--reveal-delay": "160ms" }}
              >
                Building production-ready SaaS across full-stack, AI/LLM,
                real-time systems, and cloud infrastructure.
              </p>

              <div
                className="hero-actions mt-7"
                data-reveal
                style={{ "--reveal-delay": "220ms" }}
              >
                <a
                  href="#projects"
                  className="action-pill action-pill--accent"
                >
                  View project work <ArrowDown size={16} />
                </a>

                <nav
                  className="hero-profile-directory"
                  aria-label="Professional profiles"
                >

                  <div className="hero-profile-directory__links">
                    <a
                      href={profile.github}
                      className="hero-profile-directory__link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub profile (opens in a new tab)"
                      title="GitHub"
                    >
                      <span className="hero-profile-directory__brand hero-profile-directory__brand--github">
                        <FaGithub aria-hidden="true" />
                      </span>
                    </a>
                    <a
                      href={profile.linkedin}
                      className="hero-profile-directory__link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn profile (opens in a new tab)"
                      title="LinkedIn"
                    >
                      <span className="hero-profile-directory__brand hero-profile-directory__brand--linkedin">
                        <FaLinkedinIn aria-hidden="true" />
                      </span>
                    </a>
                    <a
                      href={profile.leetcode}
                      className="hero-profile-directory__link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LeetCode profile (opens in a new tab)"
                      title="LeetCode"
                    >
                      <span className="hero-profile-directory__brand hero-profile-directory__brand--leetcode">
                        <SiLeetcode aria-hidden="true" />
                      </span>
                    </a>
                    <a
                      href={`mailto:${profile.email}`}
                      className="hero-profile-directory__link"
                      aria-label={`Email ${profile.name}`}
                      title="Email"
                    >
                      <span className="hero-profile-directory__brand hero-profile-directory__brand--gmail">
                        <SiGmail aria-hidden="true" />
                      </span>
                    </a>
                  </div>
                </nav>
              </div>
            </div>

            <aside
              className="hero-proof-panel hero-profile-card"
              data-reveal="scale"
              style={{ "--reveal-delay": "260ms" }}
            >
              <div className="hero-proof-panel__coming-soon hero-profile-photo-card">
                <img
                  src={profile.photo}
                  alt="Rohit Singh Pokhariya - AI Full Stack Developer"
                  className="hero-profile-photo"
                  width="1122"
                  height="1402"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <div className="hero-profile-card__identity">
                <h3 className="text-[1.35rem] font-black leading-tight md:text-[1.68rem]">
                  {profile.name}
                </h3>
                <p className="utility-label text-accent-ink">{profile.role}</p>
                <p className="hero-profile-card__stack text-muted">
                  MERN • Next.js • AI/LLM • Cloud &amp; DevOps
                </p>
              </div>
            </aside>
          </div>

          <div
            className="hero-meta-grid"
            data-reveal
            role="group"
            aria-label="Portfolio highlights"
            style={{ "--reveal-delay": "320ms" }}
          >
            {proofStats.map(([label, value], index) => (
              <dl
                key={label}
                className="hero-meta-item"
                style={{ "--meta-delay": `${index * 70}ms` }}
              >
                <dt className="utility-label text-muted">{label}</dt>
                <dd className="mt-2 whitespace-nowrap font-display text-[1.75rem] font-bold uppercase leading-none sm:text-[1.9rem] lg:text-[2rem]">
                  {value}
                </dd>
              </dl>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
