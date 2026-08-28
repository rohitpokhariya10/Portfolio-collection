// Keeps the profile narrative and its supporting facts in one named landmark.
import { ArrowUpRight } from "lucide-react";
import { contactLinks, profile } from "@/data/portfolio";

const summaryFacts = [
  ["Current work", "Construction ERP at Sharnex"],
  ["Project proof", "StudyNotion + BidArena"],
  ["AI / LLM", "LangChain, RAG + agentic systems"],
  ["Delivery", "Full stack through cloud and CI/CD"],
];

const aboutContactLinks = contactLinks.filter(({ label }) =>
  ["Email", "Phone", "LinkedIn", "GitHub"].includes(label),
);

export const About = () => {
  return (
    <section
      id="about"
      className="about-section section-panel border-b border-border/70"
      aria-labelledby="about-title"
    >
      <div className="page-shell">
        <div className="about-summary-grid">
          <div className="about-summary-heading" data-reveal>
            <p className="utility-label text-accent-ink">About / summary</p>
            <h2
              id="about-title"
              className="section-title about-summary-title mt-4"
            >
              Product engineering from schema to production.
            </h2>
          </div>

          <div
            className="about-summary-content"
            data-reveal
            style={{ "--reveal-delay": "90ms" }}
          >
            <p className="section-copy about-summary-copy">{profile.summary}</p>

            <address className="about-contact-grid not-italic">
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
            </address>
          </div>
        </div>

        <dl className="about-facts-grid">
          {summaryFacts.map(([label, value], index) => (
            <div
              key={label}
              className="proof-tile about-fact"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` }}
            >
              <dt className="utility-label text-muted">{label}</dt>
              <dd className="about-fact__value">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
