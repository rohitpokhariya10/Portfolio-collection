// Grouped skill proof presented as alternating, accessible marquee rows.
import {
  Braces,
  Boxes,
  Cloud,
  Code2,
  Cpu,
  CreditCard,
  Database,
  Globe2,
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
  "C++": devicon("cplusplus"),
  Java: devicon("java"),
  HTML5: devicon("html5"),
  CSS3: devicon("css3"),
  "React.js": devicon("react"),
  "Next.js": devicon("nextjs"),
  "Tailwind CSS": devicon("tailwindcss"),
  "Node.js": devicon("nodejs"),
  "Express.js": devicon("express"),
  "Google OAuth 2.0": devicon("google"),
  "MongoDB (Mongoose)": devicon("mongodb"),
  PostgreSQL: devicon("postgresql"),
  Redis: devicon("redis"),
  Git: devicon("git"),
  GitHub: devicon("github"),
  Docker: devicon("docker"),
  Postman: devicon("postman"),
  Vercel: devicon("vercel"),
};

const skillFallbackIcons = {
  SQL: Database,
  "Responsive Design": MonitorSmartphone,
  "Cross-Browser Compatibility": Globe2,
  "REST API Design": Network,
  "JWT Authentication": KeyRound,
  "MVC Architecture": Boxes,
  "Google Gemini API": Sparkles,
  Razorpay: CreditCard,
  Cloudinary: Cloud,
  ImageKit: ImageIcon,
  "Data Structures & Algorithms": Workflow,
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
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
    </span>
  );
};

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
        tabIndex={duplicate ? -1 : 0}
      >
        <SkillIcon item={item} />
        <span className="skill-chip__label">{item}</span>
      </li>
    ))}
  </ul>
);

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

        <div className="skill-marquee-list mt-12" role="list">
          {skillGroups.map((group, index) => {
            const labelId = `skill-category-${index}`;
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
