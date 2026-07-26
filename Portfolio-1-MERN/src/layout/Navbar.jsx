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
  const menuButtonRef = useRef(null);
  const menuPanelRef = useRef(null);
  const pastHeroRef = useRef(!introGated);
  const revealScrollYRef = useRef(0);
  const shouldRestoreMenuFocusRef = useRef(true);
  const isContactPage = window.location.pathname.replace(/\/+$/, "") === "/contact";

  useLayoutEffect(() => {
    // Route changes can swap the pinned home intro for a conventional page.
    // Reset before paint so stale visibility state never flashes between routes.
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

    // Keep the panel mounted for its closing animation, then make every control
    // genuinely absent from both the DOM and the accessibility tree.
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
    const particleScrollZone = introGated
      ? document.querySelector("[data-hero-scroll-zone]")
      : null;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactPointerQuery = window.matchMedia(
      "(max-width: 767px), (pointer: coarse)",
    );

    const updateNavState = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const isScrollingDown = currentScrollY > previousScrollY;
      const usesPinnedHero = !reducedMotionQuery.matches
        && !compactPointerQuery.matches;
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

      // Scroll can fire much faster than React should reconcile navigation state;
      // one read and update per paint avoids layout thrashing on high-Hz devices.
      frameId = window.requestAnimationFrame(updateNavState);
    };

    updateNavState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    reducedMotionQuery.addEventListener?.("change", handleScroll);
    compactPointerQuery.addEventListener?.("change", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      reducedMotionQuery.removeEventListener?.("change", handleScroll);
      compactPointerQuery.removeEventListener?.("change", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [introGated, isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const menuButton = menuButtonRef.current;
    const menuPanel = menuPanelRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const focusFrameId = window.requestAnimationFrame(() => {
      menuPanel?.querySelector("a")?.focus();
    });

    const handleMenuKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      // The expanded disclosure visually covers the page. Cycling between its
      // trigger and links keeps keyboard focus inside the visible controls while
      // body scrolling is locked, without claiming ARIA modal semantics.
      const panelLinks = Array.from(
        menuPanel?.querySelectorAll("a[href]") || [],
      );
      const focusableItems = [menuButton, ...panelLinks].filter(
        (item) => item && item.getClientRects().length > 0,
      );

      if (!focusableItems.length) {
        return;
      }

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstItem || !focusableItems.includes(activeElement))) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    window.addEventListener("keydown", handleMenuKeyDown);

    return () => {
      const focusWasInsidePanel = menuPanel?.contains(document.activeElement);

      window.cancelAnimationFrame(focusFrameId);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleMenuKeyDown);

      if (
        shouldRestoreMenuFocusRef.current
        && focusWasInsidePanel
        && menuButton?.getClientRects().length
      ) {
        menuButton.focus({ preventScroll: true });
      }
    };
  }, [isMobileMenuOpen]);

  const introHidden = introGated && !pastHero;
  const navShouldTranslate = introHidden || (isNavHidden && !isMobileMenuOpen);

  return (
    <header
      className={`site-header ${introGated ? "fixed inset-x-0" : "sticky"} top-0 z-50 border-b-2 border-ink transition-[transform,opacity,background-color,box-shadow,backdrop-filter] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
      onFocusCapture={() => setIsNavHidden(false)}
    >
      <nav
        className="page-shell grid min-h-16 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-5"
        aria-label="Primary navigation"
      >
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
              aria-current={
                link.href === "/contact" && isContactPage ? "page" : undefined
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={profile.resume}
          className="action-pill hidden h-10 justify-self-end px-5 sm:inline-flex"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Résumé (opens in a new tab)"
        >
          Resume
        </a>

        <div className="flex justify-end lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            className="action-pill relative h-10 gap-2 px-2.5 pr-4"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              shouldRestoreMenuFocusRef.current = true;
              setIsMobileMenuOpen((open) => !open);
            }}
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

      {(isMenuRendered || isMobileMenuOpen) && (
        <>
          <button
            type="button"
            className={`nav-backdrop fixed inset-x-0 bottom-0 cursor-default bg-background/70 backdrop-blur-[2px] lg:hidden ${
              isMobileMenuOpen ? "is-open" : "is-closing"
            }`}
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav
            ref={menuPanelRef}
            id="mobile-navigation"
            className={`nav-menu-panel absolute left-0 top-full w-full origin-top overflow-y-auto overscroll-contain border-y border-border bg-background/95 shadow-[0_18px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden ${
              isMobileMenuOpen ? "is-open" : "is-closing"
            }`}
            aria-hidden={!isMobileMenuOpen}
            inert={!isMobileMenuOpen}
            aria-label="Mobile navigation"
          >
            <div className="page-shell grid gap-2 py-4 sm:grid-cols-2 md:grid-cols-5">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-menu-link action-pill justify-center px-4 py-3"
                  style={{ "--menu-delay": `${index * 35}ms` }}
                  onClick={() => {
                    shouldRestoreMenuFocusRef.current = false;
                    setIsMobileMenuOpen(false);
                  }}
                  aria-current={
                    link.href === "/contact" && isContactPage ? "page" : undefined
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
