// Experience records for teaching, project practice, and education.
// This keeps the portfolio grounded after the louder collage sections.
const entries = [
  {
    number: "01",
    label: "BrightChamps",
    title: "Coding Instructor",
    detail:
      "I teach Scratch, HTML, CSS, and JavaScript across grades 1-12, then review student work closely enough to know where the confusion usually hides.",
  },
  {
    number: "02",
    label: "Project practice",
    title: "MERN development",
    detail:
      "I build React interfaces, REST API flows, Node/Express backends, MongoDB data models, and deployable project structures.",
  },
  {
    number: "03",
    label: "Education",
    title: "B.Tech CSE graduate",
    detail:
      "Computer science gave me the base; the projects gave me the practical habit of shipping, checking, and improving.",
  },
];

/**
 * Renders experience as numbered editorial records instead of a resume block.
 */
export const ProfessionalJourney = () => {
  return (
    <section id="experience" className="border-b-2 border-ink py-16 md:py-24">
      <div className="page-shell">
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-end">
          <div>
            <p className="utility-label">Experience / marked up by real work</p>
            <h2 className="display-section mt-4 max-w-[8ch]">
              Build it. Teach it. Fix it.
            </h2>
          </div>
          <p className="body-large">
            My week is split between explaining code to students and building
            projects that force the same clarity back onto my own work.
          </p>
        </div>

        <div className="mt-12 grid border-2 border-ink md:grid-cols-3">
          {entries.map((entry) => (
            <article
              key={entry.number}
              className="border-b-2 border-ink p-5 last:border-b-0 md:border-b-0 md:border-r-2 md:last:border-r-0"
            >
              <p className="utility-label text-signal">{entry.number}</p>
              <p className="utility-label mt-8">{entry.label}</p>
              <h3 className="mt-3 font-display text-6xl font-black uppercase leading-[0.82] tracking-[-0.04em]">
                {entry.title}
              </h3>
              <p className="mt-5 text-lg font-bold leading-tight text-muted">
                {entry.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
