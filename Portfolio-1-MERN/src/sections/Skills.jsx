import { useState } from "react";
import {
  Cloud,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Server,
  Wrench,
} from "lucide-react";

const tabs = [
  { key: "frontend", label: "Frontend", icon: Layers3 },
  { key: "backend", label: "Backend", icon: Server },
  { key: "tools", label: "Tools", icon: Wrench },
  { key: "deployment", label: "Deployment", icon: Cloud },
];

const skillIcons = {
  HTML: Code2,
  CSS: Code2,
  JavaScript: Code2,
  React: Layers3,
  "Next.js": Layers3,
  "Tailwind CSS": Layers3,
  SCSS: Code2,
  "Node.js": Server,
  "Express.js": Server,
  MongoDB: Database,
  "REST APIs": Server,
  Git: GitBranch,
  GitHub: GitBranch,
  Postman: Wrench,
  Vercel: Cloud,
  Render: Cloud,
};

export const Skills = () => {
  // activeTab → currently selected tab
  //setActiveTab → tab change karne ka button
  const [activeTab, setActiveTab] = useState("frontend");

  // Marquee skills (all skills)
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "C++",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Vercel",
    "Tailwind CSS",
    "Git",
    "GitHub",
  ];

  // Tab based skills
  //category wise ui tabhi obj bnaya
  //“Tab ka naam hi key hoga aur us key ke andar us tab ki skills
  //Kal new tab add karna ho → bas object me ek key add krdo value ke sath obviously
  const skillsData = {
    frontend: ["HTML", "CSS", "SCSS", "JavaScript", "React", "Next.js", "Tailwind CSS"],
    backend: ["Node.js", "Express.js", "MongoDB", "REST APIs"],
    tools: ["Git", "GitHub", "Postman"],
    deployment: ["Vercel", "Render"],
  };

  return (
    <section id="skills" className="section-shell relative py-24 md:py-36 overflow-hidden">

      {/* ===== Content Wrapper ===== */}
      <div className="container mx-auto px-5 sm:px-8">

        {/* ===== Section Intro ===== */}
        <div className="max-w-4xl mb-10 md:mb-14 reveal-on-scroll">
          <span className="section-kicker">Toolkit</span>
          <h2 className="section-title mt-5">
            Built for the{" "}
            <span className="font-serif italic font-normal text-white">
              modern web.
            </span>
          </h2>
          <p className="section-copy mt-6">
            A practical full-stack toolkit for building clean interfaces,
            reliable APIs, and deployable web applications.
          </p>
        </div>

        <div className="skills-panel rounded-3xl py-8 sm:py-10 reveal-on-scroll">
          {/* ===== Marquee ===== */}
          <div className="relative overflow-hidden mb-12">

            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface/90 to-transparent z-10" />

            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface/90 to-transparent z-10" />

            {/* Marquee content */}
            <div className="flex w-max animate-marquee gap-x-14 sm:gap-x-20 lg:gap-x-24">
              {[...skills, ...skills].map((skill, idx) => (
                <div key={idx} className="flex-shrink-0">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.04em] text-muted-foreground/55 hover:text-primary transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Tabs ===== */}
          <div className="px-5 sm:px-8">
            <div className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1.5 rounded-2xl border border-border/80 bg-background/45 p-1.5 shadow-inner shadow-black/20">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold
                  transition-all duration-300 sm:px-5
                  ${
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            </div>
          </div>

          {/* ===== Skills per active tab ===== */}
          <div className="mx-5 mt-8 rounded-2xl border border-border/70 bg-background/25 p-4 sm:mx-8 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {tabs.find((tab) => tab.key === activeTab)?.label} stack
              </p>
              <span className="text-xs text-muted-foreground">
                {skillsData[activeTab].length} technologies
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* skillsData[activeTab] ---->abhi konsa key choose kra hai (dynamically skillsData ki keys ko access karna) */}
              {skillsData[activeTab].map((skill) => {
                const SkillIcon = skillIcons[skill];

                return (
                  <div
                    key={skill}
                    className="group flex items-center gap-3 rounded-xl border border-border/70 bg-surface/65 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <SkillIcon className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {skill}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
