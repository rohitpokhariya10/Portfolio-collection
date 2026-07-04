// Sticky navigation for the editorial portfolio shell.
// It keeps the top chrome compact so the oversized hero type can do the talking.
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { profile } from "@/data/portfolio";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

/**
 * Renders the sticky nav and a small mobile menu without scroll listeners.
 */
export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper">
      <nav className="page-shell grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 py-3">
        <a
          href="/"
          className="logo-mark h-11 w-11 overflow-hidden rounded-2xl border-2 border-ink bg-ink"
          aria-label={`${profile.name} home`}
        >
          <img
            src={profile.logo}
            alt=""
            className="h-full w-full object-cover"
          />
        </a>

        <a
          href={profile.resume}
          className="pill interactive-lift h-10 px-5 font-mono text-xs font-bold uppercase tracking-[0.12em] hover:bg-ink hover:text-paper"
        >
          Resume
        </a>

        <div className="flex justify-end">
          <button
            type="button"
            className="pill interactive-lift relative h-10 gap-2 px-2.5 pr-4 font-mono text-xs font-bold uppercase tracking-[0.08em] hover:bg-ink hover:text-paper"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-current bg-paper">
              <img
                src={profile.photo}
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span className="hidden sm:inline">Menu</span>
            {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="nav-menu-panel border-t-2 border-ink bg-paper">
          <div className="page-shell grid gap-2 py-4 sm:grid-cols-5">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-menu-link pill interactive-lift px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] hover:bg-ink hover:text-paper"
                style={{ "--menu-delay": `${index * 35}ms` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
