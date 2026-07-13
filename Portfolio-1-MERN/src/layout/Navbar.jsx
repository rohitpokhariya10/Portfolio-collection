// Sticky navigation for the editorial portfolio shell.
// It keeps the top chrome compact so the oversized hero type can do the talking.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

/**
 * Renders the sticky nav, overlay mobile menu, and scroll-aware hide/reveal.
 */
export const Navbar = ({ introGated = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(() => !introGated);
  const pastHeroRef = useRef(!introGated);
  const revealScrollYRef = useRef(0);

  useLayoutEffect(() => {
    const nextPastHero = !introGated;

    pastHeroRef.current = nextPastHero;
    revealScrollYRef.current = 0;
    setPastHero(nextPastHero);
    setIsNavHidden(false);

    if (introGated) {
      setIsMobileMenuOpen(false);
    }
  }, [introGated]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMenuRendered(true);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsMenuRendered(false);
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const closeDesktopMenu = () => {
      if (desktopQuery.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    closeDesktopMenu();
    desktopQuery.addEventListener("change", closeDesktopMenu);

    return () => desktopQuery.removeEventListener("change", closeDesktopMenu);
  }, []);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let frameId = 0;

    const updateNavState = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const isScrollingDown = currentScrollY > previousScrollY;
      const particleScrollZone = introGated
        ? document.querySelector("[data-hero-scroll-zone]")
        : null;
      const usesPinnedHero = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        && !window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
      const thresholdOffset = usesPinnedHero ? window.innerHeight : 100;
      const heroThreshold = particleScrollZone
        ? particleScrollZone.offsetTop
          + particleScrollZone.offsetHeight
          - thresholdOffset
        : Math.max(window.innerHeight - 100, 0);
      const nextPastHero = !introGated || currentScrollY > heroThreshold;
      const justPassedHero = nextPastHero && !pastHeroRef.current;

      if (nextPastHero !== pastHeroRef.current) {
        pastHeroRef.current = nextPastHero;
        setPastHero(nextPastHero);

        if (justPassedHero) {
          revealScrollYRef.current = currentScrollY;
        } else {
          revealScrollYRef.current = 0;
          setIsMobileMenuOpen(false);
        }
      }

      setIsScrolled(currentScrollY > 8);

      if (!nextPastHero) {
        setIsNavHidden(false);
      } else if (justPassedHero) {
        setIsNavHidden(false);
      } else if (isMobileMenuOpen || currentScrollY < 90) {
        setIsNavHidden(false);
      } else if (
        isScrollingDown
        && (
          !introGated
          || currentScrollY > revealScrollYRef.current + 160
        )
      ) {
        setIsNavHidden(true);
      } else if (currentScrollY < previousScrollY) {
        setIsNavHidden(false);
      }

      previousScrollY = currentScrollY;
      frameId = 0;
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateNavState);
    };

    updateNavState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [introGated, isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

  const introHidden = introGated && !pastHero;
  const navShouldTranslate = introHidden || (isNavHidden && !isMobileMenuOpen);

  return (
    <header
      className={`${introGated ? "fixed inset-x-0" : "sticky"} top-0 z-50 border-b-2 border-ink transition-[transform,opacity,background-color,box-shadow,backdrop-filter] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        navShouldTranslate ? "-translate-y-full" : "translate-y-0"
      } ${
        introHidden ? "pointer-events-none opacity-0" : "opacity-100"
      } ${
        isScrolled || isMobileMenuOpen
          ? "bg-paper/95 shadow-[0_8px_24px_rgba(20,20,20,0.12)] backdrop-blur-md"
          : "bg-paper"
      }`}
      aria-hidden={introHidden}
      inert={introHidden}
    >
      <nav className="page-shell grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-5">
        <a
          href="/"
          className="logo-mark h-11 w-11 overflow-hidden rounded-2xl border border-border bg-card"
          aria-label={`${profile.name} home`}
        >
          <img
            src={profile.logo}
            alt=""
            className="h-full w-full object-cover"
          />
        </a>

        <div className="hidden min-w-0 justify-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-desktop-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={profile.resume}
          className="action-pill hidden h-10 px-5 sm:inline-flex"
        >
          Resume
        </a>

        <div className="flex justify-end lg:hidden">
          <button
            type="button"
            className="action-pill relative h-10 gap-2 px-2.5 pr-4"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full border border-current bg-card">
              <img
                src={profile.photo}
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span className="hidden sm:inline">Menu</span>
            <span
              className={`menu-glyph ${isMobileMenuOpen ? "is-open" : ""}`}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      {isMenuRendered && (
        <>
          <button
            type="button"
            className={`nav-backdrop fixed inset-x-0 bottom-0 top-[4.75rem] cursor-default bg-background/70 backdrop-blur-[2px] lg:hidden ${
              isMobileMenuOpen ? "is-open" : "is-closing"
            }`}
            aria-label="Close navigation menu"
            tabIndex={-1}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            id="mobile-navigation"
            className={`nav-menu-panel absolute left-0 top-full w-full origin-top border-y border-border bg-background/95 shadow-[0_18px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden ${
              isMobileMenuOpen ? "is-open" : "is-closing"
            }`}
          >
            <div className="page-shell grid gap-2 py-4 sm:grid-cols-5">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-menu-link action-pill justify-center px-4 py-3"
                  style={{ "--menu-delay": `${index * 35}ms` }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
