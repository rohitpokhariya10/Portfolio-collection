// Professional portfolio bookend with navigation, contact, and identity details.
import {
  ArrowUp,
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { profile } from "@/data/portfolio";

const footerNavigation = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

const footerConnections = [
  {
    href: `mailto:${profile.email}`,
    label: "Email",
    icon: Mail,
  },
  {
    href: profile.linkedin,
    label: "LinkedIn",
    icon: Linkedin,
    external: true,
  },
  {
    href: profile.github,
    label: "GitHub",
    icon: Github,
    external: true,
  },
  {
    href: profile.leetcode,
    label: "LeetCode",
    icon: Code2,
    external: true,
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="site-footer__top">
          <div className="site-footer__intro">
            <a
              href="/"
              className="site-footer__brand"
              aria-label={`${profile.name} home`}
            >
              <span className="site-footer__brand-mark" aria-hidden="true">
                <img src={profile.logo} alt="" />
              </span>
              <span className="site-footer__brand-copy">
                <strong>{profile.shortName}</strong>
                <span>{profile.role}</span>
              </span>
            </a>

            <p className="site-footer__eyebrow utility-label">
              Product-minded engineering / end to end
            </p>
            <h2 className="site-footer__headline">
              Complex ideas.
              <span>Clear, reliable software.</span>
            </h2>
            <p className="site-footer__summary">
              Building production-grade, AI-integrated web products—from
              thoughtful interfaces to resilient APIs, data systems, and
              deployment.
            </p>

            <div className="site-footer__meta utility-label">
              <span>
                <MapPin size={14} aria-hidden="true" />
                {profile.location} / Remote collaboration
              </span>
            </div>

            <a
              href={`mailto:${profile.email}`}
              className="site-footer__contact-card"
            >
              <span>
                <span className="utility-label">Start a conversation</span>
                <strong>{profile.email}</strong>
              </span>
              <span className="site-footer__contact-icon" aria-hidden="true">
                <ArrowUpRight size={22} />
              </span>
            </a>
          </div>

          <div className="site-footer__directory">
            <nav className="site-footer__nav" aria-label="Footer navigation">
              <p className="site-footer__directory-title utility-label">
                Explore
              </p>
              <ul className="site-footer__link-list">
                {footerNavigation.map((link, index) => (
                  <li key={link.href}>
                    <a href={link.href} className="site-footer__link">
                      <span>{link.label}</span>
                      <span aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="site-footer__nav" aria-label="Social links">
              <p className="site-footer__directory-title utility-label">
                Connect
              </p>
              <ul className="site-footer__link-list">
                {footerConnections.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="site-footer__link"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                      aria-label={
                        link.external
                          ? `${link.label} (opens in a new tab)`
                          : undefined
                      }
                    >
                      <span>{link.label}</span>
                      <link.icon size={17} aria-hidden="true" />
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={profile.resume}
                    className="site-footer__link"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Résumé (opens in a new tab)"
                  >
                    <span>Résumé</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <p className="site-footer__wordmark" aria-hidden="true">
          <span>Rohit</span>
          <span>Pokhariya</span>
        </p>

        <div className="site-footer__bottom utility-label">
          <p>© {currentYear} {profile.name}. All rights reserved.</p>
          <p>Designed and engineered with intention.</p>
          <a href="#root" className="site-footer__back-to-top">
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};
