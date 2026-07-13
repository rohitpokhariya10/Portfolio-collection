// Motion-forward hero led by the Full Stack AI Developer identity.
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { ParticleText } from "@/Components/ParticleText";
import { profile, proofStats } from "@/data/portfolio";

export const Hero = () => {
  return (
    <section className="hero-section relative overflow-hidden border-b border-border/70">
      <h1 id="home-page-title" className="sr-only" tabIndex={-1}>
        {profile.name} — {profile.role}
      </h1>

      <div className="hero-particle-stage">
        <ParticleText text={profile.shortName} label={profile.name} />
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
                className="mt-8 flex flex-wrap gap-3"
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
              <img
                src={profile.photo}
                alt={profile.name}
                className="hero-proof-panel__photo"
              />
              <div className="grid gap-3">
                <p className="utility-label text-accent-ink">Now shipping</p>
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
              <a href={profile.website} aria-label="Portfolio website">
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
