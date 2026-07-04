// Striped contact CTA and footer utility close.
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/portfolio";

const footerLinks = [
  { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
  { href: profile.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: profile.github, label: "GitHub", icon: Github },
];

/**
 * Renders the final get-in-touch band and footer bookend.
 */
export const Footer = ({ showCta = true }) => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {showCta && (
        <section className="bg-paper py-10 text-ink md:py-14" aria-label="Get in touch">
          <div className="page-shell">
            <a
              href="/contact"
              className="cta-band mx-auto flex min-h-[12rem] max-w-[72rem] flex-col items-center justify-center rounded-full border-2 border-ink px-6 py-10 text-center shadow-[12px_12px_0_var(--color-ink)] md:min-h-[16rem]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, var(--color-band-coral) 0 16px, var(--color-band-butter) 16px 32px)",
              }}
            >
              <span className="utility-label">Let's create something impactful together</span>
              <span className="cta-band__headline display-section mt-3">Get in touch</span>
            </a>
          </div>
        </section>
      )}

      <footer className="border-t-2 border-paper bg-ink py-8 text-paper md:py-10">
        <div className="page-shell">
          <p
            className="footer-signature font-display text-[5.2rem] font-black uppercase tracking-[-0.04em] md:text-[9rem] lg:text-[12rem]"
            aria-label="Rohit Pokhariya"
          >
            <span>Rohit</span>
            <span>Pokhariya</span>
          </p>

          <div className="mt-8 grid gap-4 border-t-2 border-paper pt-5 md:grid-cols-[1fr_auto] md:items-center">
            <p className="utility-label">
              © {currentYear} Rohit Singh Pokhariya / {profile.location}
            </p>

            <nav className="flex flex-wrap gap-4 md:justify-end">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="utility-label inline-flex items-center gap-2 underline decoration-paper decoration-2 underline-offset-4 hover:text-accent-mint"
                >
                  {link.label} <link.icon size={15} />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
};
