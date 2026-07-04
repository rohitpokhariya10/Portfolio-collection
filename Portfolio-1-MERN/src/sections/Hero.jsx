// Oversized editorial hero with a real-photo collage.
// The collage introduces the person and the work before any formal project list.
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { profile, projects } from "@/data/portfolio";

const heroShots = projects.filter((project) => project.image).slice(0, 3);

/**
 * Renders the first viewport: giant compressed type, one collage card, and a
 * compact utility bar with real links.
 */
export const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink pb-10 pt-9 md:pb-14 md:pt-14">
      <div className="page-shell">
        <div className="relative min-h-[calc(100vh-8rem)]">
          <p
            className="utility-label mb-4 max-w-sm"
            data-reveal
          >
            Fresh CSE graduate / MERN stack / open to software development roles
          </p>

          <h1
            className="hero-name"
            data-reveal
            style={{ "--reveal-delay": "80ms" }}
          >
            <span className="block">Rohit</span>
            <span className="block">Pokhariya</span>
          </h1>

          <div className="hero-role-block relative grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.42fr)]">
            <div data-reveal style={{ "--reveal-delay": "150ms" }}>
              <h2 className="hero-role max-w-[10ch] text-accent-periwinkle">
                MERN builder
              </h2>
              <p className="body-large mt-5">
                I build the kind of full-stack projects where the UI, API, and
                data flow can survive a curious reviewer and a very honest demo.
              </p>
            </div>

            <div data-reveal="scale" style={{ "--reveal-delay": "220ms" }}>
              <div className="relative mx-auto w-full max-w-[30rem] rotate-[5deg] border-2 border-ink bg-paper p-3 shadow-[0_24px_55px_rgba(20,20,20,0.26)] md:-mt-24 lg:mx-0">
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="h-full min-h-[19rem] w-full border-2 border-ink object-cover"
                  />
                  <div className="grid gap-3">
                    {heroShots.map((project) => (
                      <img
                        key={project.id}
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        className="h-24 w-full border-2 border-ink object-cover sm:h-28"
                      />
                    ))}
                  </div>
                </div>
                <p className="hand-note absolute -bottom-8 left-4 max-w-[16rem] rotate-[-8deg] text-signal">
                  Teaching by day, debugging my own ambition over a Diet Coke.
                </p>
              </div>
            </div>
          </div>

          <div
            className="mt-20 grid gap-3 border-y-2 border-ink py-4 md:grid-cols-3 md:items-center md:gap-6"
            data-reveal
            style={{ "--reveal-delay": "280ms" }}
          >
            <p className="utility-label">01 / Actual photo + actual projects</p>
            <div className="flex flex-wrap gap-4 md:justify-center">
              <a
                href={profile.github}
                className="utility-label inline-flex items-center gap-2 underline decoration-ink decoration-2 underline-offset-4 hover:-translate-y-0.5 hover:text-signal"
              >
                GitHub <Github size={15} />
              </a>
              <a
                href={profile.linkedin}
                className="utility-label inline-flex items-center gap-2 underline decoration-ink decoration-2 underline-offset-4 hover:-translate-y-0.5 hover:text-signal"
              >
                LinkedIn <Linkedin size={15} />
              </a>
            </div>
            <a
              href="#projects"
              className="utility-label inline-flex items-center gap-2 hover:-translate-y-0.5 hover:text-signal md:justify-end"
            >
              {profile.role} <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
