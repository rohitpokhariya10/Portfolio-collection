import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingScreen } from "@/Components/LoadingScreen";
import { CustomCursor } from "@/Components/CustomCursor";
import { Navbar } from "@/layout/Navbar";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Contact } from "@/sections/Contact";
import { Skills } from "@/sections/Skills";
import { ProfessionalJourney } from "@/sections/ProfessionalJourney";
import { ContactCta } from "@/sections/ContactCta";
import { Footer } from "./layout/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLenisScroll } from "@/hooks/useLenisScroll";

const normalizePath = (pathname) =>
  pathname === "/" ? pathname : pathname.replace(/\/+$/, "");

const getRoute = () =>
  normalizePath(window.location.pathname) === "/contact" ? "contact" : "home";

const getHashTarget = (hash) => {
  if (!hash || hash === "#") {
    return null;
  }

  try {
    // IDs are looked up directly instead of being interpolated into a CSS
    // selector, so encoded or user-authored hashes cannot throw a selector error.
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
};

const getFocusTarget = (target) => {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  if (target.id === "root") {
    return document.querySelector("#home-page-title, #contact-page-title");
  }

  const labelledBy = target.getAttribute("aria-labelledby")?.split(/\s+/);
  const labelledElement = labelledBy
    ?.map((id) => document.getElementById(id))
    .find((element) => element instanceof HTMLElement);

  if (labelledElement) {
    return labelledElement;
  }

  if (target.classList.contains("project-panel-sentinel")) {
    return target.nextElementSibling?.querySelector("h1, h2, h3, h4") || target;
  }

  if (target.matches("main, h1, h2, h3, h4")) {
    return target;
  }

  return target.querySelector("h1, h2, h3, h4") || target;
};

const scrollToTarget = (target, { focus = false } = {}) => {
  if (target !== 0 && !(target instanceof HTMLElement)) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (focus) {
    // Intercepted hash links must reproduce native navigation for keyboard and
    // screen-reader users, not merely move the visual viewport.
    const focusTarget = target === 0
      ? document.querySelector("#home-page-title, #contact-page-title")
      : getFocusTarget(target);

    if (focusTarget) {
      if (!focusTarget.hasAttribute("tabindex")) {
        focusTarget.tabIndex = -1;
      }

      focusTarget.focus({ preventScroll: true });
    }
  }

  // Lenis owns the active scroll position while enhanced scrolling is enabled;
  // falling back to platform scrolling keeps routing functional without it.
  if (window.__lenis && !reduceMotion) {
    window.__lenis.scrollTo(target, {
      offset: 0,
      duration: 1.05,
    });
    return;
  }

  if (target === 0) {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    return;
  }

  target?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
};

const App = () => {
  const [route, setRoute] = useState(getRoute);
  const [isLoading, setIsLoading] = useState(true);
  const [heroAnimationReady, setHeroAnimationReady] = useState(false);
  const initialHashHandledRef = useRef(false);
  const isContactRoute = route === "contact";

  useLenisScroll(!isLoading);
  useScrollReveal(route, heroAnimationReady || !isLoading);

  const handleLoaderExitStart = useCallback(() => {
    setHeroAnimationReady(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    if (initialHashHandledRef.current) {
      return undefined;
    }

    initialHashHandledRef.current = true;

    if (!window.location.hash) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToTarget(getHashTarget(window.location.hash), { focus: true });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isLoading]);

  useEffect(() => {
    document.title = isContactRoute
      ? "Contact | Rohit Singh Pokhariya"
      : "Rohit Singh Pokhariya | Full Stack AI Developer";

    if (isLoading || window.location.hash) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      const pageTitle = document.querySelector(
        isContactRoute ? "#contact-page-title" : "#home-page-title",
      );
      pageTitle?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isContactRoute, isLoading]);

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());

    const handleHistoryChange = () => {
      syncRoute();

      // `popstate` can change only the hash, in which case React correctly keeps
      // the same route mounted and no route effect is available to reposition it.
      window.requestAnimationFrame(() => {
        if (window.location.hash) {
          scrollToTarget(getHashTarget(window.location.hash), { focus: true });
        } else {
          scrollToTarget(0, { focus: true });
        }
      });
    };

    const handleRouteClick = (event) => {
      if (
        event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
        || !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest("a[href]");

      if (!anchor || event.defaultPrevented || anchor.target || anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      const normalizedPath = normalizePath(url.pathname);

      if (url.origin !== window.location.origin || !["/", "/contact"].includes(normalizedPath)) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", `${normalizedPath}${url.hash}`);
      syncRoute();

      // Defer until React has committed the destination route. This lets a link
      // move between `/` and `/contact` and still resolve a target in the new DOM.
      window.requestAnimationFrame(() => {
        if (url.hash) {
          scrollToTarget(getHashTarget(url.hash), { focus: true });
          return;
        }

        scrollToTarget(0, { focus: true });
      });
    };

    document.addEventListener("click", handleRouteClick);
    window.addEventListener("popstate", handleHistoryChange);

    return () => {
      document.removeEventListener("click", handleRouteClick);
      window.removeEventListener("popstate", handleHistoryChange);
    };
  }, []);

  return (
    <>
      <CustomCursor />

      {isLoading && (
        <LoadingScreen
          preloadParticleHero={!isContactRoute}
          onExitStart={handleLoaderExitStart}
          onComplete={handleLoaderComplete}
        />
      )}

      <div
        className="min-h-screen overflow-x-clip bg-paper text-ink"
        aria-busy={isLoading}
        aria-hidden={isLoading}
        inert={isLoading}
      >
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[2100] -translate-y-[calc(100%+2rem)] rounded-full border-2 border-ink bg-paper px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink shadow-lg transition-transform focus:translate-y-0"
          style={{
            left: "max(1rem, env(safe-area-inset-left, 0px))",
            top: "calc(1rem + env(safe-area-inset-top, 0px))",
          }}
        >
          Skip to main content
        </a>

        <Navbar introGated={!isContactRoute} />

        <main id="main-content" className="route-enter" key={route} tabIndex={-1}>
          {isContactRoute ? (
            <Contact />
          ) : (
            <>
              <Hero particleActive={heroAnimationReady} />
              <About />
              <Skills />
              <Projects />
              <ProfessionalJourney />
              <ContactCta />
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default App;
