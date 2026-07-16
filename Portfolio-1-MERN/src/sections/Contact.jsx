// Dedicated contact page wired to the existing Vercel/Resend endpoint.
import { useRef, useState } from "react";
import { Linkedin, LoaderCircle, Mail, Send } from "lucide-react";
import { profile } from "@/data/portfolio";

const projectTypes = [
  "Full-Stack Web App",
  "AI/SaaS Product",
  "Freelance/Contract",
  "Other",
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectType: projectTypes[0],
  message: "",
  honeypot: "",
};

export const Contact = () => {
  const startedAt = useRef(Date.now());
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const isSubmitting = status === "loading";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = [
      form.firstName.trim(),
      form.lastName.trim(),
      form.email.trim(),
      form.message.trim(),
    ];

    if (requiredFields.some((value) => !value)) {
      setStatus("error");
      setFeedback("Please fill in your name, email, and project details.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          elapsedMs: Date.now() - startedAt.current,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not send your message. Please try again.");
      }

      setForm(initialForm);
      startedAt.current = Date.now();
      setStatus("success");
      setFeedback("Message sent — I'll get back to you soon.");
    } catch (error) {
      setStatus("error");
      setFeedback(error.message || "Failed to send your message. Please try again.");
    }
  };

  return (
    <section className="contact-page section-panel">
      <div className="page-shell grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-start lg:gap-16">
        <div data-reveal>
          <p className="utility-label text-accent-ink">Contact / collaboration</p>
          <h1
            id="contact-page-title"
            className="section-title contact-page__title mt-4"
            tabIndex={-1}
          >
            Let's connect
          </h1>
          <p className="section-copy mt-7">
            I'm open to full-stack and AI-integrated project work and
            collaboration. If you have an idea in mind, I'd be happy to hear
            about it.
          </p>

          <div className="contact-channels mt-10">
            <a href={`mailto:${profile.email}`} className="contact-channel">
              <span className="contact-channel__icon" aria-hidden="true">
                <Mail size={18} />
              </span>
              <span>
                <span className="utility-label text-muted">Project inquiries</span>
                <span className="contact-channel__value">{profile.email}</span>
              </span>
            </a>

            <a href={profile.linkedin} className="contact-channel">
              <span className="contact-channel__icon" aria-hidden="true">
                <Linkedin size={18} />
              </span>
              <span>
                <span className="utility-label text-muted">LinkedIn</span>
                <span className="contact-channel__value">
                  {profile.linkedinLabel}
                </span>
              </span>
            </a>
          </div>
        </div>

        <form
          className="contact-form relative grid gap-6"
          data-reveal="scale"
          style={{ "--reveal-delay": "120ms" }}
          onSubmit={handleSubmit}
          aria-labelledby="contact-form-title"
          aria-busy={isSubmitting}
        >
          <header className="border-b border-border pb-5">
            <h2 id="contact-form-title" className="contact-form__title">
              Start a project
            </h2>
            <p className="mt-2 font-semibold leading-relaxed text-muted">
              Tell me about your vision and let's make it reality
            </p>
          </header>

          <div
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="honeypot"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="utility-label">First name</span>
              <input
                name="firstName"
                type="text"
                required
                maxLength={80}
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange}
                className="field-control"
              />
            </label>

            <label className="grid gap-2">
              <span className="utility-label">Last name</span>
              <input
                name="lastName"
                type="text"
                required
                maxLength={80}
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange}
                className="field-control"
              />
            </label>

            <label className="grid gap-2">
              <span className="utility-label">Email address</span>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="field-control"
              />
            </label>

            <label className="grid gap-2">
              <span className="utility-label">Phone number</span>
              <input
                name="phone"
                type="tel"
                maxLength={30}
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                className="field-control"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="utility-label">Project type</span>
              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                className="field-control"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="utility-label">Project details</span>
              <textarea
                name="message"
                required
                maxLength={3000}
                rows={7}
                placeholder="Share the product idea, problem, or scope you have in mind."
                value={form.message}
                onChange={handleChange}
                className="field-control resize-y"
              />
            </label>

            <div className="grid gap-3 md:col-span-2 sm:grid-cols-[auto_1fr] sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="striped-action contact-submit disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={17} />
                ) : (
                  <Send size={17} />
                )}
                {isSubmitting ? "Sending..." : "Send message"}
              </button>

              <p
                className={`form-feedback min-h-5 font-mono text-xs font-bold leading-snug ${
                  status === "error" ? "text-signal" : "text-ink"
                }`}
                aria-live="polite"
              >
                {feedback}
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
