// Compact bio section for verified facts and voice.
// It bridges the hero collage into the project proof without adding resume fluff.
const facts = [
  ["Education", "B.Tech in Computer Science & Engineering"],
  ["Current focus", "MERN stack applications and software development roles"],
  ["Teaching", "Scratch, HTML, CSS, and JavaScript across grades 1-12"],
  ["Build habit", "Write the data first, then let React map the interface"],
];

/**
 * Renders a short editorial bio using only confirmed profile facts.
 */
export const About = () => {
  return (
    <section id="about" className="border-b-2 border-ink py-16 md:py-24">
      <div className="page-shell grid gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
        <div>
          <p className="utility-label">About / less fog, more receipts</p>
          <h2 className="display-section mt-4 max-w-[8ch]">
            I like proof more than polish.
          </h2>
        </div>

        <div>
          <p className="body-large">
            I’m Rohit, a MERN developer and B.Tech CSE graduate building
            full-stack projects while teaching code fundamentals. Useful combo:
            I can build the thing, then explain why the thing is shaped that
            way.
          </p>

          <div className="mt-10 grid border-2 border-ink bg-accent-mint md:grid-cols-2">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="border-b-2 border-ink p-5 last:border-b-0 md:border-r-2 md:[&:nth-child(even)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <p className="utility-label">{label}</p>
                <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
