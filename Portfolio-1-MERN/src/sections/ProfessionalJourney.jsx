// Combines chronological work history with supporting education and achievements.
import { achievements, education, experience } from "@/data/portfolio";

export const ProfessionalJourney = () => {
  return (
    <section
      id="experience"
      className="section-panel border-b border-border/70"
      aria-labelledby="experience-title"
    >
      <div className="page-shell">
        <div className="section-heading-grid">
          <div data-reveal>
            <p className="utility-label text-accent-ink">Experience / education</p>
            <h2 id="experience-title" className="section-title mt-4">
              Professional proof beyond projects.
            </h2>
          </div>
          <p
            className="section-copy"
            data-reveal
            style={{ "--reveal-delay": "90ms" }}
          >
            Production ERP ownership at Sharnex leads the story, supported by
            international mentoring and a Computer Science Engineering foundation.
          </p>
        </div>

        <div className="journey-grid mt-12">
          <ol className="grid list-none gap-4 p-0" aria-label="Work experience">
            {experience.map((entry, index) => (
              <li
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
              </li>
            ))}
          </ol>

          <div
            className="journey-card-reveal"
            data-reveal
            style={{ "--reveal-delay": "160ms" }}
          >
            <article className="journey-card journey-card--accent">
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
                <h4 className="utility-label">Achievements</h4>
                <ul className="mt-4 grid gap-3 text-base font-black leading-snug">
                  {achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
