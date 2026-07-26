// A single, full-surface link keeps the closing call to action touch-friendly.
export const ContactCta = () => {
  return (
    <section
      className="contact-cta-section section-panel"
      aria-labelledby="contact-cta-title"
    >
      <div className="page-shell" data-reveal="scale">
        <a href="/contact" className="contact-cta">
          <span className="contact-cta__eyebrow utility-label">
            Let's build something impactful together
          </span>
          <h2 id="contact-cta-title" className="contact-cta__headline">
            Get in touch
          </h2>
        </a>
      </div>
    </section>
  );
};
