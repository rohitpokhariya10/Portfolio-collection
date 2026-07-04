// Contact form section with real routes, lightweight validation, and API submit.
import { useRef, useState } from "react";
import { Github, Linkedin, LoaderCircle, Mail, Send } from "lucide-react";
import { profile } from "@/data/portfolio";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectType: "Full-time role",
  message: "",
  honeypot: "",
};

const contactLinks = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/rohitpokhariya10",
    href: profile.github,
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "rohit-singh-pokhariya-24742a220",
    href: profile.linkedin,
    icon: Linkedin,
  },
];

const projectTypes = [
  "Full-time role",
  "Freelance project",
  "MERN collaboration",
  "Just saying hi",
];

/**
 * Renders a real contact form and verified contact links.
 */
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
      setFeedback("Please fill in your name, email, and message.");
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
          email: form.email.trim(),
          elapsedMs: Date.now() - startedAt.current,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not send message. Please try again.");
      }

      setForm(initialForm);
      startedAt.current = Date.now();
      setStatus("success");
      setFeedback("Message sent — I'll get back to you soon.");
    } catch (error) {
      setStatus("error");
      setFeedback(error.message || "Failed to send message, please try again.");
    }
  };

  return (
    <section id="contact" className="border-b-2 border-ink bg-paper py-16 text-ink md:py-24">
      <div className="page-shell grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <div data-reveal>
          <p className="utility-label">Get in touch</p>
          <h2 className="display-section mt-4 max-w-[9ch]">Let's connect</h2>
          <p className="body-large mt-7">
            Open to Software Developer and MERN stack roles where the work is
            real, the UI matters, and the backend has to hold up.
          </p>

          <div className="mt-10 grid gap-3">
            {contactLinks.map((item, index) => (
              <div
                key={item.label}
                data-reveal
                style={{ "--reveal-delay": `${index * 70 + 120}ms` }}
              >
                <a
                  href={item.href}
                  className="interactive-lift group grid gap-3 border-2 border-ink bg-paper p-4 hover:bg-ink hover:text-paper sm:grid-cols-[8rem_1fr] sm:items-center"
                >
                  <span className="utility-label inline-flex items-center gap-2">
                    <item.icon size={15} />
                    {item.label}
                  </span>
                  <span className="break-words font-mono text-xs font-bold leading-snug">
                    {item.value}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>

        <form
          className="relative grid gap-4 border-2 border-ink p-3 md:p-4"
          data-reveal="scale"
          style={{
            "--reveal-delay": "120ms",
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--color-band-coral) 0 12px, var(--color-band-butter) 12px 24px)",
          }}
          onSubmit={handleSubmit}
        >
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

          <div className="grid gap-4 bg-paper p-4 md:grid-cols-2 md:p-5">
            <label className="grid gap-2">
              <span className="utility-label">First name</span>
              <input
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange}
                className="field-control border-2 border-ink bg-paper px-4 py-3 font-mono text-sm font-bold outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="utility-label">Last name</span>
              <input
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange}
                className="field-control border-2 border-ink bg-paper px-4 py-3 font-mono text-sm font-bold outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="utility-label">Email address</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="field-control border-2 border-ink bg-paper px-4 py-3 font-mono text-sm font-bold outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="utility-label">Phone number</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                className="field-control border-2 border-ink bg-paper px-4 py-3 font-mono text-sm font-bold outline-none"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="utility-label">Project / role type</span>
              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                className="field-control border-2 border-ink bg-paper px-4 py-3 font-mono text-sm font-bold outline-none"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="utility-label">Message / details</span>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Tell me what you're looking for..."
                value={form.message}
                onChange={handleChange}
                className="field-control resize-none border-2 border-ink bg-paper px-4 py-3 font-mono text-sm font-bold outline-none"
              />
            </label>

            <div className="grid gap-3 md:col-span-2 sm:grid-cols-[auto_1fr] sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="pill pill-dark interactive-lift h-12 gap-2 px-6 font-mono text-xs font-bold uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <Send size={16} />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {feedback && (
                <p
                  className={`form-feedback font-mono text-xs font-bold leading-snug ${
                    status === "success" ? "text-ink" : "text-signal"
                  }`}
                  role="status"
                >
                  {feedback}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
