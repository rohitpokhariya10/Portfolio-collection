// Final portfolio bookend and utility links.
import { Code2, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/portfolio";

const footerLinks = [
  { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
  { href: profile.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: profile.github, label: "GitHub", icon: Github },
  { href: profile.leetcode, label: "LeetCode", icon: Code2 },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-background py-8 text-foreground md:py-10">
      <div className="page-shell">
        <div
          className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center"
          data-reveal
          style={{ "--reveal-delay": "90ms" }}
        >
          <p className="utility-label text-muted">
            © {currentYear} {profile.name} / {profile.role}
          </p>

          <nav
            className="footer-links md:justify-end"
            aria-label="Contact and social links"
          >
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="inline-link">
                {link.label} <link.icon size={15} />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
