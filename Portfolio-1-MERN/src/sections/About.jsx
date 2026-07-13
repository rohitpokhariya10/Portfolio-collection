// Professional summary and verified profile facts.
import { ArrowUpRight } from "lucide-react";
import { contactLinks, profile } from "@/data/portfolio";

const summaryFacts = [
  ["Current build", "CrediFlow AI for Indian MSMEs"],
  ["Shipped products", "StudyNotion + Arifex-AI"],
  ["Teaching", "20+ students in daily live sessions"],
  ["Availability", "Open to full-stack and software roles"],
];

const aboutContactLinks = contactLinks.filter(({ label }) =>
  ["Email", "Phone", "LinkedIn", "GitHub"].includes(label),
);

export const About = () => {
  return (
    <section
      id="about"
      className="about-section section-panel border-b border-border/70"
    >
      <div className="page-shell">
        <div className="about-summary-grid">
          <div className="about-summary-heading" data-reveal>
            <p className="utility-label text-accent-ink">About / summary</p>
            <h2 className="section-title about-summary-title mt-4">
              Product engineering from interface to infrastructure.
            </h2>
          </div>

          <div
            className="about-summary-content"
            data-reveal
            style={{ "--reveal-delay": "90ms" }}
          >
            <p className="section-copy about-summary-copy">{profile.summary}</p>

            <div className="about-contact-grid">
              {aboutContactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="info-link about-contact-link"
                >
                  <span className="about-contact-link__meta">
                    <span className="utility-label text-muted">{link.label}</span>
                    <ArrowUpRight
                      className="about-contact-link__icon"
                      size={15}
                      strokeWidth={2}
                    />
                  </span>
                  <span className="about-contact-link__value">{link.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="about-facts-grid">
          {summaryFacts.map(([label, value], index) => (
            <article
              key={label}
              className="proof-tile about-fact"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` }}
            >
              <p className="utility-label text-muted">{label}</p>
              <p className="about-fact__value">{value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
