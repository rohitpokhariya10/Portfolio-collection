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
          <span id="contact-cta-title" className="contact-cta__headline">
            Get in touch
          </span>
        </a>
      </div>
    </section>
  );
};
