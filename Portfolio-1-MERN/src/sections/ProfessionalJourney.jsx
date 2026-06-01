import { BriefcaseBusiness, CheckCircle2, GraduationCap } from "lucide-react";

const experiencePoints = [
  "Built responsive frontend interfaces with React and Tailwind CSS.",
  "Worked with Node.js, Express.js, MongoDB, and REST API integrations.",
  "Focused on reusable components, maintainable code, and practical UX.",
];

const educationPoints = [
  "Bachelor of Technology in Computer Science and Engineering.",
  "Strong foundation in programming, problem-solving, and web development.",
  "Continuously learning modern full-stack tools and deployment workflows.",
];

const journey = [
  {
    icon: BriefcaseBusiness,
    label: "Experience",
    title: "Project-Based MERN Development",
    subtitle: "Hands-on full-stack application building",
    description:
      "Applied modern web development skills through end-to-end projects, from interface design to backend integration and deployment.",
    points: experiencePoints,
  },
  {
    icon: GraduationCap,
    label: "Education",
    title: "B.Tech in Computer Science & Engineering",
    subtitle: "Computer Science graduate",
    description:
      "Built a technical foundation in software development and strengthened it through practical MERN stack projects.",
    points: educationPoints,
  },
];

export const ProfessionalJourney = () => {
  return (
    <section
      id="experience"
      className="section-shell relative overflow-hidden py-24 md:py-36"
    >
      <div className="container mx-auto px-5 sm:px-8">
        <div className="max-w-4xl reveal-on-scroll">
          <span className="section-kicker">Professional Journey</span>
          <h2 className="section-title mt-5">
            Learning by{" "}
            <span className="font-serif italic font-normal text-white">
              building.
            </span>
          </h2>
          <p className="section-copy mt-6">
            A practical development journey grounded in computer science and
            shaped by building complete web applications.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-5 sm:gap-6 reveal-on-scroll">
          {journey.map((item) => (
            <article
              key={item.label}
              className="glass rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex w-12 h-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {item.label}
                </span>
              </div>

              <h3 className="mt-6 text-2xl sm:text-3xl font-bold tracking-[-0.04em]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-secondary-foreground">
                {item.subtitle}
              </p>
              <p className="mt-5 text-muted-foreground">{item.description}</p>

              <ul className="mt-6 space-y-3">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
