// Motion-forward hero led by the Full Stack AI Developer identity.
import { useEffect, useRef } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
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

      stage.style.setProperty("--particle-motion-opacity", motionOpacity.toFixed(4));
      stage.style.setProperty("--particle-ui-opacity", interfaceOpacity.toFixed(4));
    };

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
    <section className="hero-section relative overflow-x-clip border-b border-border/70">
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
              <ArrowDown color="var(--color-signal)" size={15} strokeWidth={2.25} />
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell">
        <div className="grid content-between gap-10 py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(18rem,0.32fr)] lg:items-end">
            <div className="min-w-0">
              <p className="utility-label text-accent-ink" data-reveal>
                {profile.shortName} / {profile.role}
              </p>

              <h2
                className="hero-role-title mt-5"
                data-reveal="line"
                style={{ "--reveal-delay": "80ms" }}
              >
                <span>Full Stack</span>
                <span>AI Developer</span>
              </h2>

              <p
                className="hero-subline mt-6"
                data-reveal
                style={{ "--reveal-delay": "160ms" }}
              >
                {profile.subline}
              </p>

              <div
                className="hero-actions mt-8"
                data-reveal
                style={{ "--reveal-delay": "220ms" }}
              >
                <a
                  href="#projects"
                  className="action-pill action-pill--accent"
                >
                  View AI work <ArrowDown size={16} />
                </a>
                <a href="/contact" className="action-pill">
                  Contact me <Mail size={16} />
                </a>
              </div>
            </div>

            <aside
              className="hero-proof-panel"
              data-reveal="scale"
              style={{ "--reveal-delay": "260ms" }}
            >
              <div
                className="hero-proof-panel__coming-soon"
                role="img"
                aria-label="CrediFlow AI product preview coming soon"
              >
                <span
                  className="hero-proof-panel__preview-label utility-label"
                  aria-hidden="true"
                >
                  Product preview / 01
                </span>
                <strong
                  className="hero-proof-panel__coming-soon-title"
                  aria-hidden="true"
                >
                  <span>Coming</span>
                  <span>Soon</span>
                </strong>
                <span
                  className="hero-proof-panel__preview-meta utility-label"
                  aria-hidden="true"
                >
                  <span>CrediFlow / AI</span>
                  <span>In development</span>
                </span>
              </div>
              <div className="grid gap-3">
                <p className="utility-label text-accent-ink">In development</p>
                <p className="text-2xl font-black leading-none md:text-3xl">
                  CrediFlow AI
                </p>
                <p className="text-sm font-semibold leading-snug text-muted">
                  Automated invoice recovery for Indian MSMEs with Redis,
                  BullMQ, Socket.io, Razorpay, and AI-assisted workflows.
                </p>
              </div>
            </aside>
          </div>

          <div
            className="hero-meta-grid"
            data-reveal
            style={{ "--reveal-delay": "320ms" }}
          >
            {proofStats.map(([label, value], index) => (
              <div
                key={label}
                className="hero-meta-item"
                style={{ "--meta-delay": `${index * 70}ms` }}
              >
                <p className="utility-label text-muted">{label}</p>
                <p className="mt-2 font-display text-4xl font-black uppercase leading-none md:text-5xl">
                  {value}
                </p>
              </div>
            ))}

            <div className="hero-socials">
              <a href={profile.github} aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href={profile.linkedin} aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
