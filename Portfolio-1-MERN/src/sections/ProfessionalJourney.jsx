// Experience, education, and achievements from the attached portfolio brief.
import { achievements, education, experience } from "@/data/portfolio";

export const ProfessionalJourney = () => {
  return (
    <section id="experience" className="section-panel border-b border-border/70">
      <div className="page-shell">
        <div className="section-heading-grid">
          <div data-reveal>
            <p className="utility-label text-accent-ink">Experience / education</p>
            <h2 className="section-title mt-4">Professional proof beyond projects.</h2>
          </div>
          <p
            className="section-copy"
            data-reveal
            style={{ "--reveal-delay": "90ms" }}
          >
            Live teaching, project coordination, computer science fundamentals,
            and shipped full-stack work all feed the same product-building habit.
          </p>
        </div>

        <div className="journey-grid mt-12">
          <div className="grid gap-4">
            {experience.map((entry, index) => (
              <div
                key={`${entry.company}-${entry.role}`}
                className="journey-card-reveal"
                data-reveal
                style={{ "--reveal-delay": `${index * 80}ms` }}
              >
                <article className="journey-card">
                  <p className="utility-label text-accent-ink">
                    {entry.date} / {entry.location}
                  </p>
                  <h3 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
                    {entry.role}
                  </h3>
                  <p className="mt-1 utility-label text-muted">{entry.company}</p>
                  <p className="mt-5 text-base font-semibold leading-relaxed text-muted">
                    {entry.detail}
                  </p>
                </article>
              </div>
            ))}
          </div>

          <div
            className="journey-card-reveal"
            data-reveal
            style={{ "--reveal-delay": "160ms" }}
          >
            <aside className="journey-card journey-card--accent">
              <p className="utility-label">Education</p>
              <h3 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
                {education.degree}
              </h3>
              <p className="mt-2 text-base font-semibold leading-relaxed">
                {education.school} / {education.date}
              </p>
              <p className="mt-2 text-base font-semibold leading-relaxed">
                {education.detail}
              </p>

              <div className="mt-8 border-t border-current/30 pt-6">
                <p className="utility-label">Achievements</p>
                <ul className="mt-4 grid gap-3 text-base font-black leading-snug">
                  {achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};
