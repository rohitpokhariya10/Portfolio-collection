// Data-driven skill rows retain a readable list while progressively adding marquee motion.
import {
  Braces,
  Boxes,
  Cloud,
  Code2,
  Cpu,
  CreditCard,
  Database,
  ImageIcon,
  KeyRound,
  MonitorSmartphone,
  Network,
  Sparkles,
  Workflow,
} from "lucide-react";
import { skillGroups } from "@/data/portfolio";

const devicon = (name, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

const skillBrandIcons = {
  "JavaScript (ES6+)": devicon("javascript"),
  TypeScript: devicon("typescript"),
  "C++": devicon("cplusplus"),
  HTML5: devicon("html5"),
  CSS3: devicon("css3"),
  "React.js": devicon("react"),
  "Next.js": devicon("nextjs"),
  "Redux Toolkit": devicon("redux"),
  "Tailwind CSS": devicon("tailwindcss"),
  SCSS: devicon("sass"),
  "Node.js": devicon("nodejs"),
  "Express.js": devicon("express"),
  "Socket.IO": devicon("socketio"),
  MongoDB: devicon("mongodb"),
  Mongoose: devicon("mongoose"),
  PostgreSQL: devicon("postgresql"),
  Redis: devicon("redis"),
  Kubernetes: devicon("kubernetes"),
  Git: devicon("git"),
  GitHub: devicon("github"),
  Docker: devicon("docker"),
  "Unit Testing (Jest)": devicon("jest", "plain"),
  npm: devicon("npm", "original-wordmark"),
  Postman: devicon("postman"),
  Vercel: devicon("vercel"),
};

const skillFallbackIcons = {
  SQL: Database,
  "Responsive Design": MonitorSmartphone,
  "RESTful APIs": Network,
  JWT: KeyRound,
  "OAuth 2.0": KeyRound,
  WebSockets: Network,
  "Socket.IO": Network,
  MVC: Boxes,
  "Microservices Architecture": Boxes,
  "MongoDB Aggregation": Database,
  LangChain: Sparkles,
  "Retrieval-Augmented Generation (RAG)": Sparkles,
  "Agentic AI": Sparkles,
  "Multi-Agent Systems": Sparkles,
  "Large Language Model (LLM) APIs": Sparkles,
  "Gemini API": Sparkles,
  AWS: Cloud,
  "CI/CD": Workflow,
  Razorpay: CreditCard,
  Cloudinary: Cloud,
  ImageKit: ImageIcon,
  "Data Structures & Algorithms (DSA)": Workflow,
  DBMS: Database,
  "Operating Systems": Cpu,
  OOP: Braces,
  "Computer Networks": Network,
};

const SkillIcon = ({ item }) => {
  const FallbackIcon = skillFallbackIcons[item] ?? Code2;
  const iconSource = skillBrandIcons[item];

  return (
    <span className="skill-chip__icon" aria-hidden="true">
      <FallbackIcon className="skill-chip__fallback-icon" strokeWidth={1.8} />
      {iconSource ? (
        <img
          className="skill-chip__brand-icon"
          src={iconSource}
          alt=""
          width={25}
          height={25}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
    </span>
  );
};

// The duplicate closes the animation seam but is hidden from assistive technology.
const SkillPillGroup = ({ group, labelId, duplicate = false }) => (
  <ul
    className="skill-marquee__group"
    aria-hidden={duplicate || undefined}
    aria-labelledby={duplicate ? undefined : labelId}
  >
    {group.items.map((item) => (
      <li
        key={`${duplicate ? "duplicate" : "primary"}-${item}`}
        className="skill-chip"
      >
        <SkillIcon item={item} />
        <span className="skill-chip__label">{item}</span>
      </li>
    ))}
  </ul>
);

export const Skills = () => {
  return (
    <section
      id="skills"
      className="section-panel border-b border-border/70"
      aria-labelledby="skills-title"
    >
      <div className="page-shell">
        <div className="section-heading-grid">
          <div data-reveal>
            <p className="utility-label text-accent-ink">Skills / grouped stack</p>
            <h2 id="skills-title" className="section-title mt-4">
              Full-stack depth. AI capability.
            </h2>
          </div>
          <p
            className="section-copy"
            data-reveal
            style={{ "--reveal-delay": "90ms" }}
          >
            Languages, frontend, backend, databases, AI/LLM, cloud, DevOps,
            and core CS skills used across production work.
          </p>
        </div>

        <p id="skill-marquee-instructions" className="sr-only">
          Focus a skill category to pause its scrolling list.
        </p>

        <div className="skill-marquee-list mt-12" role="list">
          {skillGroups.map((group, index) => {
            const labelId = `skill-category-${index}`;
            // Longer categories move more slowly so every label remains readable.
            const duration = Math.min(44, 34 + group.items.length * 1.5);

            return (
              <article
                key={group.title}
                className={`skill-marquee-row ${
                  index % 2 === 0
                    ? "skill-marquee-row--left"
                    : "skill-marquee-row--right"
                }`}
                data-reveal
                role="listitem"
                tabIndex={0}
                aria-labelledby={labelId}
                aria-describedby="skill-marquee-instructions"
                style={{
                  "--reveal-delay": `${index * 70}ms`,
                  "--marquee-delay": `${480 + index * 70}ms`,
                  "--marquee-duration": `${duration}s`,
                }}
              >
                <h3
                  id={labelId}
                  className="skill-marquee-row__label utility-label text-accent-ink"
                >
                  {group.title}
                </h3>

                <div className="skill-marquee__viewport">
                  <div className="skill-marquee__track">
                    <SkillPillGroup group={group} labelId={labelId} />
                    <SkillPillGroup
                      group={group}
                      labelId={labelId}
                      duplicate
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
